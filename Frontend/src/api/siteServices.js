import { postJson, request } from "./client";

export const siteApi = {
	getCurrentUser() {
		return request("frappe.auth.get_logged_user");
	},

	getCurrentUserRoles() {
		return request("blog.api.get_current_user_roles");
	},

	getCurrentUserProfile() {
		return request("blog.api.get_current_user_profile");
	},

	subscribeNewsletter(email) {
		return postJson("blog.api.add_to_newsletter", { email });
	},
};
