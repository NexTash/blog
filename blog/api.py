import json
import random
from urllib.parse import parse_qs, urlparse

import frappe
from blog.blog.doctype.website_traffic_log.website_traffic_log import get_request_ip
from frappe.exceptions import ValidationError
from frappe.utils import escape_html, get_url, now_datetime
from frappe.utils.file_manager import save_file


@frappe.whitelist(allow_guest=True)
def register_user(email, full_name, password):
	if frappe.db.exists("User", email):
		frappe.throw("User with this email already exists")

	try:
		user = frappe.get_doc(
			{
				"doctype": "User",
				"email": email,
				"first_name": escape_html(full_name),
				"new_password": password,
				"enabled": 1,
				"send_welcome_email": 0,
			}
		)
		user.insert(ignore_permissions=True)
		user.add_roles("Blogger")
		frappe.db.commit()
		return "User registered successfully"
	except ValidationError as e:
		return f"Validation error: {e}"


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


def _password_reset_response():
	return {
		"message": "If this email is registered, password reset instructions have been sent. Please check your inbox."
	}


def create_blogger_profile(doc, method):
	frappe.set_user("Administrator")
	if not frappe.db.exists("Blogger", {"user": doc.name}):
		blogger = frappe.get_doc(
			{
				"doctype": "Blogger",
				"full_name": doc.full_name,
				"user": doc.name,
				"short_name": doc.first_name,
			}
		)
		blogger.insert(ignore_permissions=True)
		frappe.db.commit()


@frappe.whitelist()
def create_blog_post(title, content, blog_intro, category="Uncategorized", tags=None, backlinks=None):
	blogger_name = frappe.db.get_value("Blogger", {"user": frappe.session.user}, "name")
	if not blogger_name:
		frappe.throw("You are not registered as a Blogger.")

	formatted_tags = tags
	if tags:
		try:
			parsed_tags = json.loads(tags)
			if isinstance(parsed_tags, list):
				formatted_tags = ", ".join(parsed_tags)
		except (json.JSONDecodeError, TypeError):
			pass

	processed_backlinks = []
	if backlinks:
		try:
			raw_backlinks = json.loads(backlinks)
			for link in raw_backlinks:
				if link.get("url"):
					processed_backlinks.append({"link_of_original_source": link.get("url")})
		except Exception as e:
			frappe.log_error(f"Backlink processing error: {str(e)}")

	doc = frappe.get_doc(
		{
			"doctype": "Blog Post",
			"title": title,
			"blog_intro": blog_intro,
			"content": content,
			"content_type": "Rich Text",
			"blog_category": category,
			"blogger": blogger_name,
			"tags": formatted_tags,
			"custom_backlinks": processed_backlinks,
		}
	)
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

	return doc.name


@frappe.whitelist(allow_guest=True)
def get_context():
	return frappe.get_list(
		"Blog Post",
		fields=["*"],
		order_by="published_on desc, name asc",
		filters={"published": 1},
	)


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
