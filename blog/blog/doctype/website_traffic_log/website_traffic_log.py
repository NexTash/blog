import frappe
from frappe.model.document import Document


class WebsiteTrafficLog(Document):
	pass


def get_request_ip():
	if getattr(frappe.local, "request_ip", None):
		return frappe.local.request_ip

	request = getattr(frappe.local, "request", None)
	if not request:
		return None

	for header in ("X-Forwarded-For", "X-Real-IP"):
		value = request.headers.get(header)
		if value:
			return value.split(",", 1)[0].strip()

	return request.remote_addr
