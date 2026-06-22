import { reactive } from "vue";
import { createResource } from "frappe-ui";

export const blogsResource = reactive({
	data: [],
	loading: false,
	error: null,
	fetched: false,

	async fetch(force = false) {
		if (this.loading || (this.fetched && !force)) return;

		this.loading = true;
		this.error = null;
		try {
			const response = await fetch("/api/method/blog.api.get_context");
			if (!response.ok) throw new Error("Network response was not ok");
			const json = await response.json();
			this.data = json.message || [];
			this.fetched = true;
		} catch (err) {
			this.error = err.message;
		} finally {
			this.loading = false;
		}
	},
});

export const categoriesResource = reactive({
	data: [],
	loading: false,
	error: null,
	fetched: false,

	async fetch(force = false) {
		if (this.loading || (this.fetched && !force)) return;

		this.loading = true;
		this.error = null;
		try {
			const response = await fetch("/api/method/blog.api.blog_categories");
			if (!response.ok) throw new Error("Network response was not ok");
			const json = await response.json();
			this.data = json.message || [];
			this.fetched = true;
		} catch (err) {
			this.error = err.message;
		} finally {
			this.loading = false;
		}
	},
});

export const adsResource = reactive({
	data: [],
	loading: false,
	error: null,
	fetched: false,

	async fetch(force = false) {
		if (this.loading || (this.fetched && !force)) return;

		this.loading = true;
		this.error = null;
		try {
			const response = await fetch("/api/method/blog.api.get_advertisement");
			if (!response.ok) throw new Error("Network response was not ok");
			const json = await response.json();
			this.data = json.message || [];
			this.fetched = true;
		} catch (err) {
			this.error = err.message;
		} finally {
			this.loading = false;
		}
	},
});