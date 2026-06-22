import frappe
import json
from frappe.exceptions import ValidationError
from frappe.utils import escape_html, today
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
                    processed_backlinks.append({
                        # Map the 'url' from frontend to the actual Frappe fieldname
                        "link_of_original_source": link.get("url")
                    })
        except Exception as e:
            frappe.log_error(f"Backlink processing error: {str(e)}")

    # 4. Create and insert the Blog Post
    doc = frappe.get_doc({
        "doctype": "Blog Post",
        "title": title, # HTML escaping is usually handled by Frappe on save
        "blog_intro": blog_intro,
        "content": content,
        "content_type": "Rich Text",
        "blog_category": category,
        "blogger": blogger_name,
        "tags": formatted_tags,
        "custom_backlinks": processed_backlinks  # Using your table fieldname
    })
    
    doc.insert()

    # 5. Handle Image Upload
    if frappe.request.files and "meta_image" in frappe.request.files:
        file = frappe.request.files["meta_image"]
        saved_file = save_file(
            file.filename, 
            file.stream.read(), 
            "Blog Post", 
            doc.name, 
            is_private=0
        )
        doc.db_set("meta_image", saved_file.file_url)    
        
    return doc.name



@frappe.whitelist(allow_guest=True)
def get_context():
	return frappe.get_list(
		"Blog Post",
		fields=['*'],
		order_by="published_on desc, name asc",
		filters={"published": 1},
	)


@frappe.whitelist(allow_guest=True)
def blog_categories():
	return frappe.get_all("Blog Category", fields=["name", "title"], order_by="title asc")


@frappe.whitelist(allow_guest=True)
def remove_user_permission(doc=None, method=None):
    user = doc.user if doc else frappe.session.user
    permission_name = frappe.db.exists("User Permission", {
        "user": user,
        "allow": "Blogger"
    })
    if permission_name:
        frappe.delete_doc("User Permission", permission_name, ignore_permissions=True)
        return {"status": "success", "message": "User permission deleted successfully."}
    else:
        return {"status": "failed", "message": "User permission not found."}




@frappe.whitelist(allow_guest=True)
def get_advertisement():
    advertisement = frappe.get_all("Advertisement", filters={"status":"Accepted"} ,fields=["*"], order_by="creation desc")
    return advertisement