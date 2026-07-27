import json
from pydoc import doc
import random
import re
from urllib.parse import parse_qs, urlparse
import frappe
from blog.blog.doctype.website_traffic_log.website_traffic_log import get_request_ip
from frappe.exceptions import ValidationError
from frappe.utils import escape_html, get_url, now_datetime
from frappe.utils.oauth import get_oauth2_authorize_url
from frappe.utils.file_manager import save_file
from frappe.utils.password import get_decrypted_password
from frappe.www.login import sanitize_redirect
from frappe.utils import validate_email_address
from frappe import _
from frappe.utils.background_jobs import enqueue 


def _require_blogger_for_session_user():
	blogger_name = frappe.db.get_value("Blogger", {"user": frappe.session.user}, "name")
	if not blogger_name:
		frappe.throw("You are not registered as a Blogger.")
	return blogger_name


def _get_blogger_for_session_user():
	return frappe.db.get_value(
		"Blogger",
		{"user": frappe.session.user},
		["name", "full_name", "short_name", "bio", "avatar"],
		as_dict=True,
	)


def _session_user_is_system_manager():
	return "System Manager" in frappe.get_roles(frappe.session.user)


DRAFT_STATUS = "Draft"
REVIEW_STATUS = "Submitted for Review"
PUBLISHED_STATUS = "Published"
REJECTED_STATUS = "Rejected"
CTA_BLOCK_PATTERN = re.compile(
	r"<blockquote>\s*<p>\s*CTA:\s*.*?</p>(?:\s*<p>\s*URL:\s*.*?</p>)?\s*</blockquote>\s*(?:<p>\s*</p>)?",
	re.IGNORECASE | re.DOTALL,
)


def _normalize_post_status(status=None, published=0, fallback=DRAFT_STATUS):
	if published:
		return PUBLISHED_STATUS

	normalized_status = str(status or "").strip()
	if normalized_status in {DRAFT_STATUS, REVIEW_STATUS, PUBLISHED_STATUS, REJECTED_STATUS}:
		return normalized_status

	return fallback


def _blog_post_has_status_field():
	return frappe.get_meta("Blog Post").has_field("custom_post_status")


def _blog_post_has_click_field():
	return frappe.get_meta("Blog Post").has_field("custom_click_count")


def _blog_post_has_cta_button_field():
	return frappe.get_meta("Blog Post").has_field("custom_cta_button_url")


def _blog_post_list_fields(*extra_fields):
	fields = list(extra_fields)
	if _blog_post_has_status_field():
		fields.append("custom_post_status")
	if _blog_post_has_click_field():
		fields.append("custom_click_count")
	return fields


def _set_post_status(target, status):
	if not _blog_post_has_status_field():
		return

	if isinstance(target, dict):
		target["custom_post_status"] = status
		return

	target.custom_post_status = status


def _get_post_status(post, fallback=DRAFT_STATUS):
	return _normalize_post_status(
		getattr(post, "custom_post_status", None),
		published=getattr(post, "published", 0),
		fallback=fallback,
	)


def _get_post_click_count(post):
	try:
		return int(getattr(post, "custom_click_count", 0) or 0)
	except (TypeError, ValueError):
		return 0


def _normalize_cta_button_url(url):
	normalized_url = str(url or "").strip()
	if not normalized_url:
		return ""

	parsed_url = urlparse(normalized_url)
	if parsed_url.scheme not in {"http", "https"} or not parsed_url.netloc:
		frappe.throw("CTA button link must be a valid http:// or https:// URL.")

	return normalized_url


def _set_post_cta_button_url(target, url):
	if not _blog_post_has_cta_button_field():
		return

	normalized_url = _normalize_cta_button_url(url)
	if isinstance(target, dict):
		target["custom_cta_button_url"] = normalized_url
		return

	target.custom_cta_button_url = normalized_url


def _get_post_cta_button_url(post):
	if not _blog_post_has_cta_button_field():
		return ""

	return str(getattr(post, "custom_cta_button_url", "") or "").strip()


def _strip_legacy_cta_blocks(content):
	return CTA_BLOCK_PATTERN.sub("", str(content or "")).strip()


def _parse_tag_payload(tags):
	if not tags:
		return ""

	try:
		parsed_tags = json.loads(tags) if isinstance(tags, str) else tags
	except (json.JSONDecodeError, TypeError):
		parsed_tags = tags

	if isinstance(parsed_tags, str):
		parsed_tags = parsed_tags.split(",")

	if not isinstance(parsed_tags, list):
		return ""

	cleaned_tags = []
	seen_tags = set()

	for tag in parsed_tags:
		normalized_tag = str(tag or "").strip()
		if not normalized_tag:
			continue

		normalized_key = normalized_tag.casefold()
		if normalized_key in seen_tags:
			continue

		seen_tags.add(normalized_key)
		cleaned_tags.append(normalized_tag)

	return ", ".join(cleaned_tags)


def _parse_backlinks_payload(backlinks):
	processed_backlinks = []
	if backlinks:
		try:
			raw_backlinks = json.loads(backlinks) if isinstance(backlinks, str) else backlinks
			for link in raw_backlinks:
				if link.get("url"):
					processed_backlinks.append(
						{
							"link_label": (link.get("label") or "").strip(),
							"link_of_original_source": link.get("url"),
						}
					)
		except Exception as e:
			frappe.log_error(f"Backlink processing error: {str(e)}")
	return processed_backlinks


def _ensure_blog_category_route(category_name):
	if not category_name:
		return "blog/uncategorized"

	route = frappe.db.get_value("Blog Category", category_name, "route")
	if route:
		return route.strip("/")

	category = frappe.get_doc("Blog Category", category_name)
	category.set_route()
	category_route = (category.route or "").strip("/")

	if not category_route:
		category_route = f"blog/{frappe.scrub(category.title or category.name or 'uncategorized')}"

	category.db_set("route", category_route, update_modified=False)
	return category_route


def _build_blog_post_route(title, category_name):
	category_route = _ensure_blog_category_route(category_name)
	title_slug = frappe.scrub(title or "untitled")
	return f"{category_route}/{title_slug}".strip("/")


def _resolve_draft_title(title, existing_title=None):
	resolved_title = (title or "").strip()
	if resolved_title:
		return resolved_title
	if existing_title:
		return existing_title
	return f"Untitled Draft {now_datetime().strftime('%Y-%m-%d %H:%M')}"


def _get_owned_post(post_name):
	post = frappe.get_doc("Blog Post", post_name)
	if _session_user_is_system_manager():
		return post

	blogger_name = _require_blogger_for_session_user()
	if post.blogger != blogger_name:
		frappe.throw("You are not allowed to update this blog.", frappe.PermissionError)

	return post


def _get_owned_unpublished_post(post_name):
	post = _get_owned_post(post_name)
	if post.published:
		frappe.throw("Published blogs can only be edited from the backend.")
	return post


def _serialize_post_for_editor(post):
	return {
		"name": post.name,
		"title": post.title,
		"blog_intro": post.blog_intro or "",
		"content": post.content or "",
		"blog_category": post.blog_category,
		"published": post.published,
		"custom_post_status": _get_post_status(post, fallback=DRAFT_STATUS),
		"published_on": post.published_on,
		"meta_image": post.meta_image,
		"route": post.route,
		"modified": post.modified,
		"custom_click_count": _get_post_click_count(post),
		"custom_cta_button_url": _get_post_cta_button_url(post),
		"tags": [tag.strip() for tag in (post.custom_tags or "").split(",") if tag.strip()],
		"backlinks": [
			{
				"label": getattr(row, "link_label", "") or "",
				"url": row.link_of_original_source,
			}
			for row in (post.custom_backlinks or [])
			if row.link_of_original_source
		],
	}



@frappe.whitelist(allow_guest=True)
def register_user(email, full_name, password):
    if frappe.db.exists("User", email):
        frappe.throw("User with this email already exists")

    try:
        user = frappe.get_doc({
            "doctype": "User",
            "email": email,
            "first_name": escape_html(full_name),
            "new_password": password,
            "enabled": 1,
            "send_welcome_email": 0,
        })
        user.insert(ignore_permissions=True)        
        frappe.db.commit()
        return "User registered successfully"
    except Exception as e:
        frappe.throw(f"Registration failed: {str(e)}")


@frappe.whitelist(allow_guest=True, methods=["POST"])
def request_password_reset(user):
	try:
		user_doc = frappe.get_doc("User", user)
		if user_doc.name == "Administrator" or not user_doc.enabled:
			return _password_reset_response()

		user_doc.validate_reset_password()
		reset_link = user_doc._reset_password(send_email=False)
		key = parse_qs(urlparse(reset_link).query).get("key", [None])[0]

		if key:
			website_link = get_url(
				f"/Frontend/reset-password?key={key}",
				allow_header_override=False,
			)
			user_doc.password_reset_mail(website_link)
	except frappe.DoesNotExistError:
		frappe.clear_messages()
	except frappe.OutgoingEmailError:
		frappe.clear_messages()
		frappe.log_error(
			title="Website password reset email could not be sent",
			message=frappe.get_traceback(),
		)
	except Exception:
		frappe.clear_messages()
		frappe.log_error(
			title="Website password reset failed",
			message=frappe.get_traceback(),
		)

	return _password_reset_response()


@frappe.whitelist(allow_guest=True, methods=["POST"])
def reset_website_password(key, new_password):
	from frappe.core.doctype.user.user import update_password

	result = update_password(new_password=new_password, key=key, logout_all_sessions=1)
	if getattr(frappe.local.response, "http_status_code", None) == 410:
		frappe.throw(result or "This reset link is invalid or has expired.")

	return {"message": "Password updated successfully. You can continue on the website."}


@frappe.whitelist(allow_guest=True, methods=["POST"])
def get_google_login_url(redirect_to=None):
	provider = "google"
	provider_doc = frappe.db.get_value(
		"Social Login Key",
		provider,
		["enable_social_login", "client_id", "base_url"],
		as_dict=True,
	)

	client_secret = get_decrypted_password(
		"Social Login Key",
		provider,
		"client_secret",
		raise_exception=False,
	)
	if (
		not provider_doc
		or not provider_doc.enable_social_login
		or not provider_doc.client_id
		or not provider_doc.base_url
		or not client_secret
	):
		frappe.throw("Google login is not configured.")

	redirect_to = sanitize_redirect(redirect_to) or get_url(
		"/",
		allow_header_override=False,
	)

	return get_oauth2_authorize_url(provider, redirect_to)


def _password_reset_response():
	return {
		"message": "If this email is registered, password reset instructions have been sent. Please check your inbox."
	}

@frappe.whitelist()
def create_blog_post(
	title,
	content,
	blog_intro,
	category="Uncategorized",
	published=0,
	tags=None,
	backlinks=None,
	status=None,
	cta_button_url=None,
):
	blogger_name = _require_blogger_for_session_user()
	formatted_tags = _parse_tag_payload(tags)
	processed_backlinks = _parse_backlinks_payload(backlinks)
	is_system_manager = _session_user_is_system_manager()
	published = 1 if is_system_manager else 0
	resolved_status = PUBLISHED_STATUS if is_system_manager else REVIEW_STATUS
	content = _strip_legacy_cta_blocks(content)

	post_values = {
		"doctype": "Blog Post",
		"title": title,
		"blog_intro": blog_intro,
		"content": content,
		"content_type": "Rich Text",
		"blog_category": category,
		"blogger": blogger_name,
		"custom_tags": formatted_tags,
		"custom_backlinks": processed_backlinks,
		"published": published,
		"route": _build_blog_post_route(title, category),
	}
	_set_post_status(post_values, resolved_status)
	if is_system_manager:
		_set_post_cta_button_url(post_values, cta_button_url)
	doc = frappe.get_doc(post_values)
	doc.insert()

	if frappe.request.files and "meta_image" in frappe.request.files:
		file = frappe.request.files["meta_image"]
		saved_file = save_file(
			file.filename,
			file.stream.read(),
			"Blog Post",
			doc.name,
			is_private=0,
		)
		doc.db_set("meta_image", saved_file.file_url)

	status_message = (
		"Blog published successfully."
		if doc.published
		else "Blog submitted for review successfully."
	)

	return {
		"name": doc.name,
		"message": status_message,
	}

@frappe.whitelist()
def get_my_pending_posts():
	blogger_name = _require_blogger_for_session_user()
	posts = frappe.get_all(
		"Blog Post",
		fields=[
			"name",
			"title",
			"modified",
			"creation",
			"blog_category",
			"published",
			"meta_image",
			*(
				["custom_post_status"]
				if _blog_post_has_status_field()
				else []
			),
		],
		filters={"published": 0, "blogger": blogger_name},
		order_by="modified desc, creation desc",
	)
	return posts


@frappe.whitelist()
def get_my_pending_post(name):
	post = _get_owned_post(name)
	return _serialize_post_for_editor(post)


@frappe.whitelist()
def update_my_pending_post(
	name,
	title,
	content,
	blog_intro,
	category="Uncategorized",
	tags=None,
	backlinks=None,
	status=None,
	cta_button_url=None,
):
	post = _get_owned_post(name)
	is_system_manager = _session_user_is_system_manager()
	was_published = bool(post.published)
	content = _strip_legacy_cta_blocks(content)
	post.title = title
	post.blog_intro = blog_intro
	post.content = content
	post.content_type = "Rich Text"
	post.blog_category = category
	post.route = _build_blog_post_route(title, category)
	post.published = 1 if is_system_manager else 0
	_set_post_status(post, PUBLISHED_STATUS if is_system_manager else REVIEW_STATUS)
	post.custom_tags = _parse_tag_payload(tags)
	post.set("custom_backlinks", [])
	for backlink in _parse_backlinks_payload(backlinks):
		post.append("custom_backlinks", backlink)
	if is_system_manager:
		_set_post_cta_button_url(post, cta_button_url)
	post.save(ignore_permissions=True)

	if frappe.request.files and "meta_image" in frappe.request.files:
		file = frappe.request.files["meta_image"]
		saved_file = save_file(
			file.filename,
			file.stream.read(),
			"Blog Post",
			post.name,
			is_private=0,
		)
		post.db_set("meta_image", saved_file.file_url)

	return {
		"name": post.name,
		"message": (
			"Blog published successfully."
			if _get_post_status(post) == PUBLISHED_STATUS
			else "Published blog updated and resubmitted for review."
			if was_published and _get_post_status(post) == REVIEW_STATUS
			else "Blog submitted for review successfully."
			if _get_post_status(post) == REVIEW_STATUS
			else "Draft updated successfully."
		),
		"post": _serialize_post_for_editor(post),
	}


@frappe.whitelist()
def save_blog_draft(
	name=None,
	title=None,
	content=None,
	blog_intro=None,
	category="Uncategorized",
	tags=None,
	backlinks=None,
	cta_button_url=None,
):
	resolved_title = _resolve_draft_title(title)

	if name:
		post = _get_owned_post(name)
		was_published = bool(post.published)
		content = _strip_legacy_cta_blocks(content)
		post.title = _resolve_draft_title(title, post.title)
		post.blog_intro = blog_intro or ""
		post.content = content or ""
		post.content_type = "Rich Text"
		post.blog_category = category or "Uncategorized"
		post.route = _build_blog_post_route(post.title, post.blog_category)
		post.custom_tags = _parse_tag_payload(tags)
		post.set("custom_backlinks", [])
		for backlink in _parse_backlinks_payload(backlinks):
			post.append("custom_backlinks", backlink)
		if _session_user_is_system_manager():
			_set_post_cta_button_url(post, cta_button_url)
		if was_published:
			if _session_user_is_system_manager():
				post.published = 1
				_set_post_status(post, PUBLISHED_STATUS)
			else:
				post.published = 0
				_set_post_status(post, REVIEW_STATUS)
		else:
			post.published = 0
			_set_post_status(post, DRAFT_STATUS)
		post.save(ignore_permissions=True)
	else:
		blogger_name = _require_blogger_for_session_user()
		post_values = {
				"doctype": "Blog Post",
				"title": resolved_title,
				"blog_intro": blog_intro or "",
				"content": _strip_legacy_cta_blocks(content),
				"content_type": "Rich Text",
				"blog_category": category or "Uncategorized",
				"blogger": blogger_name,
				"custom_tags": _parse_tag_payload(tags),
				"custom_backlinks": _parse_backlinks_payload(backlinks),
				"published": 0,
				"route": _build_blog_post_route(resolved_title, category or "Uncategorized"),
			}
		_set_post_status(post_values, DRAFT_STATUS)
		if _session_user_is_system_manager():
			_set_post_cta_button_url(post_values, cta_button_url)
		post = frappe.get_doc(post_values)
		post.insert()

	if frappe.request.files and "meta_image" in frappe.request.files:
		file = frappe.request.files["meta_image"]
		saved_file = save_file(
			file.filename,
			file.stream.read(),
			"Blog Post",
			post.name,
			is_private=0,
		)
		post.db_set("meta_image", saved_file.file_url)

	return {
		"name": post.name,
		"message": (
			"Published changes saved successfully."
			if name and post.published
			else "Published blog moved to review successfully."
			if name and not post.published and _get_post_status(post) == REVIEW_STATUS
			else "Draft saved successfully."
		),
		"post": _serialize_post_for_editor(post),
	}


@frappe.whitelist(methods=["POST"])
def delete_my_pending_post(name):
	post = _get_owned_post(name)
	post_title = post.title or post.name
	frappe.delete_doc("Blog Post", post.name, ignore_permissions=True)
	return {
		"name": post.name,
		"message": f'"{post_title}" was deleted successfully.',
	}


@frappe.whitelist(allow_guest=True)
def get_context():
	posts = frappe.get_list(
		"Blog Post",
		fields=["*"],
		order_by="published_on desc, name asc",
		filters={"published": 1},
	)

	if not _blog_post_has_click_field():
		for post in posts:
			post["custom_click_count"] = 0

	return posts


@frappe.whitelist(allow_guest=True, methods=["POST"])
def record_post_click(name):
	if not name:
		frappe.throw("Post name is required.")

	post_name = frappe.db.get_value("Blog Post", {"name": name, "published": 1}, "name")
	if not post_name:
		frappe.throw("Published post not found.", frappe.DoesNotExistError)

	if not _blog_post_has_click_field():
		return {"name": post_name, "click_count": 0}

	frappe.db.sql(
		"""
		UPDATE `tabBlog Post`
		SET custom_click_count = COALESCE(custom_click_count, 0) + 1
		WHERE name = %s AND published = 1
		""",
		(post_name,),
	)
	click_count = frappe.db.get_value("Blog Post", post_name, "custom_click_count") or 0

	return {"name": post_name, "click_count": int(click_count)}


@frappe.whitelist(allow_guest=True)
def blog_categories():
	return frappe.get_all("Blog Category", fields=["name", "title"], order_by="title asc")


@frappe.whitelist(allow_guest=True)
def remove_user_permission(doc=None, method=None):
	user = doc.user if doc else frappe.session.user
	permission_name = frappe.db.exists(
		"User Permission",
		{
			"user": user,
			"allow": "Blogger",
		},
	)
	if permission_name:
		frappe.delete_doc("User Permission", permission_name, ignore_permissions=True)
		return {"status": "success", "message": "User permission deleted successfully."}

	return {"status": "failed", "message": "User permission not found."}


@frappe.whitelist(allow_guest=True)
def get_advertisement():
	advertisements = frappe.get_all(
		"Advertisement",
		filters={"status": "Accepted"},
		fields=["name", "title", "link", "image"],
	)
	return random.sample(advertisements, min(len(advertisements), 3))


@frappe.whitelist(allow_guest=True)
def track_traffic(
	route=None,
	route_name=None,
	page_title=None,
	referrer=None,
	visitor_id=None,
	screen_width=None,
	screen_height=None,
	language=None,
):
	user = frappe.session.user or "Guest"
	is_guest = user == "Guest"
	request = getattr(frappe.local, "request", None)

	doc = frappe.get_doc(
		{
			"doctype": "Website Traffic Log",
			"visited_at": now_datetime(),
			"is_guest": is_guest,
			"user": None if is_guest else user,
			"visitor_id": visitor_id,
			"ip_address": get_request_ip(),
			"route": route,
			"route_name": route_name,
			"page_title": page_title,
			"referrer": referrer,
			"user_agent": request.headers.get("User-Agent") if request else None,
			"screen_width": screen_width,
			"screen_height": screen_height,
			"language": language,
		}
	)
	doc.insert(ignore_permissions=True)

	event = {
		"name": doc.name,
		"visited_at": doc.visited_at,
		"is_guest": doc.is_guest,
		"user": doc.user or "Guest",
		"visitor_id": doc.visitor_id,
		"ip_address": doc.ip_address,
		"route": doc.route,
		"route_name": doc.route_name,
		"page_title": doc.page_title,
	}
	frappe.publish_realtime("blog_traffic_visit", event, after_commit=True)

	return {"name": doc.name}


def handle_new_user_setup(doc, method=None):

    user_roles = frappe.get_roles(doc.name)
    if "Blogger" not in user_roles:
        try:
            doc.add_roles("Blogger")
        except Exception as e:
            frappe.log_error(f"Failed to add Blogger role: {e}", "Role Assignment Error")
    if not frappe.db.exists("Blogger", {"user": doc.name}):
        try:
            first_name = doc.first_name or "New"
            last_name = doc.last_name or "User"
            full_name = doc.full_name or f"{first_name} {last_name}".strip()

            blogger = frappe.get_doc({
                "doctype": "Blogger",
                "full_name": full_name,
                "user": doc.name,
                "short_name": doc.first_name or doc.name.split('@')[0],
            })
            blogger.insert(ignore_permissions=True)
            frappe.db.commit() 
        except Exception:
            frappe.log_error(frappe.get_traceback(), "Blogger Profile Creation Error")


@frappe.whitelist()
def get_current_user_roles():
	return frappe.get_roles(frappe.session.user)


@frappe.whitelist()
def get_current_user_profile():
	if frappe.session.user == "Guest":
		frappe.throw("Please log in to view your profile.", frappe.PermissionError)

	user_id = frappe.session.user
	user_details = frappe.db.get_value(
		"User",
		user_id,
		["name", "full_name", "first_name", "user_image", "enabled"],
		as_dict=True,
	) or {}
	blogger = _get_blogger_for_session_user() or {}
	blogger_name = blogger.get("name")

	total_posts = frappe.db.count("Blog Post", {"blogger": blogger_name}) if blogger_name else 0
	published_posts = (
		frappe.db.count("Blog Post", {"blogger": blogger_name, "published": 1})
		if blogger_name
		else 0
	)
	has_status_field = _blog_post_has_status_field()
	draft_posts = 0
	review_posts = 0
	if blogger_name and has_status_field:
		draft_posts = frappe.db.count(
			"Blog Post",
			{"blogger": blogger_name, "custom_post_status": DRAFT_STATUS},
		)
		review_posts = frappe.db.count(
			"Blog Post",
			{"blogger": blogger_name, "custom_post_status": REVIEW_STATUS},
		)
	elif blogger_name:
		draft_posts = frappe.db.count("Blog Post", {"blogger": blogger_name, "published": 0})

	recent_posts = (
		frappe.get_all(
			"Blog Post",
			fields=_blog_post_list_fields(
				"name",
				"title",
				"blog_intro",
				"blog_category",
				"published",
				"published_on",
				"modified",
				"meta_image",
				"route",
			),
			filters={"blogger": blogger_name},
			order_by="modified desc, creation desc",
			limit=3,
		)
		if blogger_name
		else []
	)

	display_name = (
		blogger.get("full_name")
		or user_details.get("full_name")
		or user_details.get("first_name")
		or user_id.split("@")[0]
	)

	return {
		"user": {
			"email": user_id,
			"full_name": user_details.get("full_name") or "",
			"first_name": user_details.get("first_name") or "",
			"user_image": user_details.get("user_image") or "",
			"enabled": user_details.get("enabled"),
		},
		"blogger": {
			"name": blogger_name,
			"full_name": blogger.get("full_name") or "",
			"short_name": blogger.get("short_name") or "",
			"bio": blogger.get("bio") or "",
			"avatar": blogger.get("avatar") or "",
		},
		"display_name": display_name,
		"roles": frappe.get_roles(user_id),
		"stats": {
			"total_posts": total_posts,
			"published_posts": published_posts,
			"draft_posts": draft_posts,
			"review_posts": review_posts,
		},
		"recent_posts": recent_posts,
	}


@frappe.whitelist()
def get_my_blogs():
	if frappe.session.user == "Guest":
		frappe.throw("Please log in to view your blogs.", frappe.PermissionError)

	blogger = _get_blogger_for_session_user()
	if not blogger:
		return []

	return frappe.get_all(
		"Blog Post",
		fields=_blog_post_list_fields(
			"name",
			"title",
			"blog_intro",
			"blog_category",
			"published",
			"published_on",
			"modified",
			"creation",
			"meta_image",
			"route",
		),
		filters={"blogger": blogger.get("name")},
		order_by="published desc, modified desc, creation desc",
	)


@frappe.whitelist(allow_guest=True)
def add_to_newsletter(email):
  
    if not email or not validate_email_address(email):
        frappe.throw(_("Please provide a valid email address."))
    if frappe.db.exists("Subscribers", {"email": email}):
        return {
            "status": "exists",
            "message": _("You are already subscribed to our newsletter!")
        }
    try:
        doc = frappe.get_doc({
            "doctype": "Subscribers",
            "email": email,
        })
        doc.owner = "Administrator"
        doc.insert(ignore_permissions=True)
        return {
            "status": "success",
            "message": _("Thank you for subscribing!")
        }

    except Exception as e:
        frappe.log_error(frappe.get_traceback(), _("Newsletter Subscription Error"))
        frappe.throw(_("An error occurred while subscribing. Please try again later."))




def notify_subscribers_on_publish(doc, method=None):
    
    if doc.published and not doc.get("custom_email_sent_to_subscribers"):
        doc_before_save = doc.get_doc_before_save()
        was_published = doc_before_save.published if doc_before_save else 0
        
        if not was_published:
            enqueue(
                method="blog.api.send_emails_to_subscribers",
                queue="long",
                timeout=1500,
                blog_name=doc.name
            )
            
            doc.db_set("custom_email_sent_to_subscribers", 1, update_modified=False)


def send_emails_to_subscribers(blog_name):
    blog = frappe.get_doc("Blog Post", blog_name)
    
    subscribers = frappe.get_all("Subscribers", fields=["email"])
    recipient_list = [s.email for s in subscribers if s.email]

    if not recipient_list:
        return

    blog_url = get_url(blog.route)
    subject = f"New Blog Post: {blog.title}"
    
    message = f"""
        <h3>Hello Subscriber!</h3>
        <p>A new article has just been published on our blog: <b>{blog.title}</b></p>
        <p>{blog.blog_intro or ''}</p>
        <a href="{blog_url}" style="padding: 10px 20px; background-color: #b42318; color: white; text-decoration: none; border-radius: 5px;">
            Read Full Blog
        </a>
        <br><br>
        <p>Best regards,<br>The NextNews Team</p>
    """

    # Send via Frappe's Email Queue system.
    # REMOVED: now=True. 
    # Frappe will now safely generate Email Queue records and process them in chunks.
    frappe.sendmail(
        recipients=recipient_list,
        subject=subject,
        content=message
    )
