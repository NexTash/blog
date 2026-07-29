import { reactive } from "vue";
import { postForm, postJson, request } from "./client";

const POST_EDITOR_TIMEOUT_MS = 60000;

function createCachedResource(loader) {
	return reactive({
		data: [],
		loading: false,
		error: null,
		fetched: false,

		async fetch(force = false) {
			if (this.loading || (this.fetched && !force)) return this.data;

			this.loading = true;
			this.error = null;

			try {
				this.data = await loader();
				this.fetched = true;
				return this.data;
			} catch (error) {
				this.error = error.message;
				throw error;
			} finally {
				this.loading = false;
			}
		},
	});
}

export const blogApi = {
	getPosts() {
		return request("blog.api.get_context");
	},

	getCategories() {
		return request("blog.api.blog_categories");
	},

	getAdvertisements() {
		return request("blog.api.get_advertisement");
	},

	getPost(name) {
		return request(`blog.api.get_published_post?name=${encodeURIComponent(name)}`);
	},

	recordPostClick(name) {
		return postJson("blog.api.record_post_click", { name });
	},

	registerUser(payload) {
		return postJson("blog.api.register_user", payload);
	},

	requestPasswordReset(email) {
		return postJson("blog.api.request_password_reset", { user: email });
	},

	resetPassword(payload) {
		return postJson("blog.api.reset_website_password", payload);
	},

	createPost(payload) {
		const formData = new FormData();

		formData.append("title", payload.title);
		formData.append("blog_intro", payload.blog_intro);
		formData.append("content", payload.content);
		formData.append("category", payload.category);
		formData.append("tags", JSON.stringify(payload.tags || []));
		formData.append("backlinks", JSON.stringify(payload.backlinks || []));
		formData.append("status", payload.status || "Submitted for Review");

		if (payload.meta_image) {
			formData.append("meta_image", payload.meta_image);
		}

		return postForm("blog.api.create_blog_post", formData, {
			timeoutMs: POST_EDITOR_TIMEOUT_MS,
		});
	},

	saveDraft(payload) {
		const formData = new FormData();

		if (payload.name) {
			formData.append("name", payload.name);
		}

		formData.append("title", payload.title || "");
		formData.append("blog_intro", payload.blog_intro || "");
		formData.append("content", payload.content || "");
		formData.append("category", payload.category || "Uncategorized");
		formData.append("tags", JSON.stringify(payload.tags || []));
		formData.append("backlinks", JSON.stringify(payload.backlinks || []));
		formData.append("status", payload.status || "Draft");

		if (payload.meta_image) {
			formData.append("meta_image", payload.meta_image);
		}

		return postForm("blog.api.save_blog_draft", formData, {
			timeoutMs: POST_EDITOR_TIMEOUT_MS,
		});
	},

	getMyPendingPosts() {
		return request("blog.api.get_my_pending_posts");
	},

	getMyBlogs() {
		return request("blog.api.get_my_blogs");
	},

	getMyPendingPost(name) {
		return request(`blog.api.get_my_pending_post?name=${encodeURIComponent(name)}`);
	},

	updateMyPendingPost(payload) {
		const formData = new FormData();

		formData.append("name", payload.name);
		formData.append("title", payload.title);
		formData.append("blog_intro", payload.blog_intro);
		formData.append("content", payload.content);
		formData.append("category", payload.category);
		formData.append("tags", JSON.stringify(payload.tags || []));
		formData.append("backlinks", JSON.stringify(payload.backlinks || []));
		formData.append("status", payload.status || "Submitted for Review");

		if (payload.meta_image) {
			formData.append("meta_image", payload.meta_image);
		}

		return postForm("blog.api.update_my_pending_post", formData, {
			timeoutMs: POST_EDITOR_TIMEOUT_MS,
		});
	},

	deleteMyPendingPost(name) {
		return postJson("blog.api.delete_my_pending_post", { name });
	},

	trackTraffic(payload) {
		return postJson("blog.api.track_traffic", payload);
	},
};

export const blogsResource = createCachedResource(() => blogApi.getPosts());

export const categoriesResource = createCachedResource(() => blogApi.getCategories());

export const adsResource = createCachedResource(() => blogApi.getAdvertisements());
