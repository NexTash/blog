

import frappe
from frappe.utils import escape_html
from frappe.exceptions import ValidationError

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
            # "user_type": "System User"
        })
        user.insert(ignore_permissions=True)
        user.add_roles("Blogger")
        frappe.db.commit()
        return "User registered successfully"
    except ValidationError as e:
        return f"Validation error: {str(e)}"
        
        
def create_blogger_profile(doc,method):
    frappe.set_user("Administrator")
    if not frappe.db.exists("Blogger", {"user": doc.name}):
        blogger = frappe.get_doc({
            "doctype": "Blogger",
            "full_name": doc.full_name,
            "user": doc.name,
            "short_name": doc.first_name
        })
        blogger.save(ignore_permissions=True)
        frappe.db.commit()


@frappe.whitelist()
def create_blog_post(title, content, blog_intro, category="Uncategorized"):
    blogger_name = frappe.db.get_value("Blogger", {"user": frappe.session.user}, "name")
    
    if not blogger_name:
        frappe.throw("You are not registered as a Blogger.")

    doc = frappe.get_doc({
        "doctype": "Blog Post",
        "title": title,
        "blog_intro": blog_intro,
        "content": content,
        "blog_category": category,
        "blogger": blogger_name, 
    })
    doc.insert()
    return doc.name



@frappe.whitelist(allow_guest=True)
def get_context():
    docs= frappe.get_list('Blog Post' ,fields= ["*"] ,order_by="name asc" ,filters={ "published": 1 })
    return docs


@frappe.whitelist(allow_guest=True)
def blog_categories():
    return frappe.get_all("Blog Category", fields=["name", "title"])


