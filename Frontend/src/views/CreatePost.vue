<template>
	<main class="min-h-screen bg-[#f6f3ee] px-4 py-12">
		<div class="mx-auto max-w-3xl">
			<div class="surface p-6 md:p-8">
				<!-- Header -->
				<header class="mb-8 border-b border-gray-100 pb-6">
					<p class="kicker">Blogger Dashboard</p>
					<h1 class="section-heading mt-2">Create New Story</h1>
				</header>

				<!-- Error banner -->
				<div
					v-if="error"
					class="mb-6 flex items-start gap-3 rounded-md border border-red-200 bg-red-50 px-4 py-3"
				>
					<svg class="mt-0.5 h-4 w-4 shrink-0 text-red-500" fill="currentColor" viewBox="0 0 20 20">
						<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
					</svg>
					<p class="text-sm font-medium text-red-700">{{ error }}</p>
				</div>

				<form @submit.prevent="handleSubmit" class="space-y-6">
					<!-- Title -->
					<div>
						<label for="title" class="form-label">Article Title</label>
						<input
							id="title"
							v-model="form.title"
							type="text"
							required
							placeholder="Enter a clear, compelling headline"
							class="form-input text-lg font-bold"
						/>
					</div>

					<!-- Category -->
					<div>
						<label for="category" class="form-label">Category</label>
						<select id="category" v-model="form.category" required class="form-input cursor-pointer bg-white">
							<option value="" disabled>Select a category</option>
							<option v-for="cat in categories" :key="cat.name" :value="cat.name">
								{{ cat.title || cat.name }}
							</option>
						</select>
					</div>

					<!-- Short intro -->
					<div>
						<label for="blog_intro" class="form-label">Short Intro</label>
						<textarea
							id="blog_intro"
							v-model="form.blog_intro"
							rows="3"
							required
							placeholder="Write a short summary shown on cards and the detail page"
							class="form-input resize-y text-sm leading-6"
						></textarea>
					</div>

					<!-- Content -->
					<div>
						<label for="content" class="form-label">Article Body</label>
						<textarea
							id="content"
							v-model="form.content"
							rows="14"
							required
							placeholder="Write your story here. HTML is supported."
							class="form-input resize-y text-base leading-7"
						></textarea>
					</div>

					<!-- Actions -->
					<div class="flex flex-col-reverse gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
						<button
							type="button"
							@click="$router.back()"
							class="text-xs font-black uppercase tracking-[0.16em] text-gray-400 transition-colors hover:text-gray-700"
						>
							Cancel
						</button>
						<button
							type="submit"
							:disabled="loading"
							class="btn-primary disabled:cursor-not-allowed disabled:bg-gray-400"
						>
							{{ loading ? "Publishing…" : "Publish Story" }}
						</button>
					</div>
				</form>
			</div>
		</div>
	</main>
</template>

<script setup>
import { reactive, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { blogsResource } from "../api/blogServices.js";

const router = useRouter();
const loading = ref(false);
const error = ref("");
const categories = ref([]);

const form = reactive({ title: "", blog_intro: "", content: "", category: "" });

const getCsrfToken = () => window.csrf_token || window.frappe?.csrf_token || "";

const getServerMessage = (data) => {
	if (data?._server_messages) {
		try {
			return JSON.parse(JSON.parse(data._server_messages)[0]).message;
		} catch {
			// fall through
		}
	}
	return data?.exception || data?.message || "Request failed";
};

const fetchCategories = async () => {
	try {
		const response = await fetch("/api/method/blog.api.blog_categories");
		const data = await response.json();
		categories.value = data.message || [];
		if (categories.value.length > 0 && !form.category) {
			form.category = categories.value[0].name;
		}
	} catch {
		error.value = "Failed to load categories.";
	}
};

onMounted(fetchCategories);

const handleSubmit = async () => {
	error.value = "";
	loading.value = true;
	try {
		const response = await fetch("/api/method/blog.api.create_blog_post", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-Frappe-CSRF-Token": getCsrfToken(),
			},
			body: JSON.stringify(form),
		});
		const data = await response.json();
		if (!response.ok || !data.message) throw new Error(getServerMessage(data));

		// Force refresh so the new post appears in the feed immediately
		await blogsResource.fetch(true);

		router.push({ name: "PostDetail", params: { name: data.message } });
	} catch (err) {
		error.value = err.message;
	} finally {
		loading.value = false;
	}
};
</script>

<style scoped>
.form-label {
	@apply mb-2 block text-xs font-black uppercase tracking-[0.14em] text-gray-700;
}

.form-input {
	@apply w-full rounded-md border border-gray-300 px-4 py-3 outline-none transition-all placeholder:text-gray-300 focus:border-[#b42318] focus:ring-2 focus:ring-[#f5d8d4];
}
</style>
