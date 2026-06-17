
import { reactive } from "vue";
export const blogsResource = reactive({
	data: [],
	loading: false,
	error: null,
	fetched: false,

	async fetch() {
		if (this.loading || this.fetched) return;

		this.loading = true;
		try {
			const response = await fetch("/api/method/blog.api.get_context");
			if (!response.ok) throw new Error("Network response was not ok");
			const json = await response.json();
			this.data = json.message;
			this.fetched = true; 
		} catch (err) {
			this.error = err.message;
		} finally {
			this.loading = false;
		}
	},
});
