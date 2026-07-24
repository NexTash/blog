<template>
	<main class="min-h-screen bg-[#f6f3ee] px-4 py-10 md:px-6 md:py-14">
		<div class="mx-auto max-w-7xl">
			<section
				class="overflow-hidden rounded-[2rem] bg-gradient-to-r from-[#111827] via-[#1f2937] to-[#7f1d1d] px-6 py-8 text-white shadow-[0_30px_90px_rgba(15,23,42,0.20)] md:px-8 md:py-10"
			>
				<div class="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
					<div class="max-w-3xl">
						<p class="text-xs font-black uppercase tracking-[0.22em] text-[#fca5a5]">
							My Blogs
						</p>
						<h1 class="mt-3 text-4xl font-black tracking-tight md:text-5xl">
							Everything you have submitted
						</h1>
						<p class="mt-4 max-w-2xl text-sm leading-7 text-white/75">
							Track your published stories, return to drafts, and keep your author workflow in one place.
						</p>
					</div>

					<router-link to="/create-post" class="btn-primary shrink-0">
						Write new story
					</router-link>
				</div>

				<div class="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
					<div class="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur">
						<p class="text-xs font-black uppercase tracking-[0.18em] text-white/60">Total</p>
						<p class="mt-3 text-4xl font-black">{{ posts.length }}</p>
					</div>
					<div class="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur">
						<p class="text-xs font-black uppercase tracking-[0.18em] text-white/60">Published</p>
						<p class="mt-3 text-4xl font-black">{{ publishedCount }}</p>
					</div>
					<div class="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur">
						<p class="text-xs font-black uppercase tracking-[0.18em] text-white/60">Drafts</p>
						<p class="mt-3 text-4xl font-black">{{ draftCount }}</p>
					</div>
					<div class="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur">
						<p class="text-xs font-black uppercase tracking-[0.18em] text-white/60">In Review</p>
						<p class="mt-3 text-4xl font-black">{{ reviewCount }}</p>
					</div>
				</div>
			</section>

			<section class="mt-8 surface p-5 md:p-6">
				<div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
					<div class="flex flex-wrap gap-2">
						<button
							v-for="option in filters"
							:key="option.value"
							type="button"
							class="rounded-full border px-4 py-2 text-xs font-black uppercase tracking-[0.14em] transition-colors"
							:class="
								activeFilter === option.value
									? 'border-[#b42318] bg-[#b42318] text-white'
									: 'border-gray-200 bg-white text-gray-700 hover:border-[#b42318] hover:text-[#b42318]'
							"
							@click="activeFilter = option.value"
						>
							{{ option.label }}
						</button>
					</div>

					<label class="relative block w-full max-w-md">
						<span class="sr-only">Search your blogs</span>
						<input
							v-model.trim="searchQuery"
							type="search"
							placeholder="Search by title or category"
							class="w-full rounded-2xl border border-gray-200 bg-[#f8f6f2] px-4 py-3 text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 focus:border-[#b42318] focus:bg-white"
						/>
					</label>
				</div>
			</section>

			<div v-if="loading" class="flex flex-col items-center justify-center py-24">
				<div class="h-10 w-10 animate-spin rounded-full border-b-2 border-[#b42318]"></div>
				<p class="mt-4 text-sm font-medium text-gray-400">Loading your blogs...</p>
			</div>

			<div
				v-else-if="error"
				class="surface mt-8 flex flex-col items-start gap-4 px-6 py-8 md:px-8"
			>
				<p class="kicker">Could Not Load</p>
				<h2 class="text-2xl font-black tracking-tight text-gray-900">
					We could not load your stories right now.
				</h2>
				<p class="text-sm leading-6 text-gray-600">{{ error }}</p>
				<button class="btn-primary" type="button" @click="fetchPosts">Try again</button>
			</div>

			<div
				v-else-if="filteredPosts.length"
				class="mt-8 grid grid-cols-1 gap-6 xl:grid-cols-2"
			>
				<article
					v-for="post in filteredPosts"
					:key="post.name"
					class="surface group overflow-hidden"
				>
					<div class="grid h-full md:grid-cols-[220px_1fr]">
						<div class="relative min-h-[220px] overflow-hidden bg-gray-900">
							<img
								:src="getImageUrl(post.meta_image)"
								:alt="post.title"
								class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
							/>
							<div class="absolute left-4 top-4 flex flex-wrap gap-2">
								<span
									class="rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em]"
									:class="statusBadgeClass(post)"
								>
									{{ postStatus(post) }}
								</span>
								<span class="story-chip bg-white text-gray-900 shadow-none">
									{{ post.blog_category || "General" }}
								</span>
							</div>
						</div>

						<div class="flex min-h-[220px] flex-col p-6">
							<div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-bold uppercase tracking-[0.14em] text-gray-400">
								<span>
									{{ postStatus(post) === "Published" ? "Published" : "Updated" }}
									{{ formatDate(post.published ? post.published_on : post.modified) }}
								</span>
								<!-- <span aria-hidden="true">|</span>
								<span>{{ post.name }}</span> -->
							</div>

							<h2 class="mt-4 text-2xl font-black leading-tight tracking-tight text-gray-900">
								{{ post.title }}
							</h2>

							<p v-if="post.blog_intro" class="mt-3 line-clamp-4 text-sm leading-7 text-gray-600">
								{{ post.blog_intro }}
							</p>
							<p v-else class="mt-3 text-sm leading-7 text-gray-400">
								No introduction was added for this story yet.
							</p>

							<div class="mt-auto flex flex-wrap gap-3 pt-6">
								<router-link
									:to="primaryActionLink(post)"
									class="btn-primary"
								>
									{{ postStatus(post) === "Published" ? "View story" : "Edit draft" }}
								</router-link>
							</div>
						</div>
					</div>
				</article>
			</div>

			<div
				v-else
				class="surface mt-8 rounded-[2rem] border border-dashed border-gray-300 bg-white px-6 py-16 text-center"
			>
				<p class="kicker">{{ posts.length ? "No Match" : "No Blogs Yet" }}</p>
				<h2 class="mt-3 text-3xl font-black tracking-tight text-gray-900">
					{{ posts.length ? "No stories match your filters." : "Your stories will show up here." }}
				</h2>
				<p class="mt-3 text-sm leading-6 text-gray-500">
					{{
						posts.length
							? "Try a different search or switch filters to find the story you need."
							: "Create your first blog post and come back here to manage it."
					}}
				</p>
				<div class="mt-6 flex flex-wrap justify-center gap-3">
					<button
						v-if="posts.length"
						type="button"
						class="btn-secondary"
						@click="resetFilters"
					>
						Clear filters
					</button>
					<router-link to="/create-post" class="btn-primary">
						Write new story
					</router-link>
				</div>
			</div>
		</div>
	</main>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { blogApi } from "../api/blogServices";
import { formatDate, getImageUrl } from "../utils/post";

const posts = ref([]);
const loading = ref(true);
const error = ref("");
const activeFilter = ref("all");
const searchQuery = ref("");

const filters = [
	{ label: "All", value: "all" },
	{ label: "Published", value: "published" },
	{ label: "Drafts", value: "drafts" },
	{ label: "In Review", value: "review" },
];

function postStatus(post) {
	return post.custom_post_status || (post.published ? "Published" : "Draft");
}

function statusBadgeClass(post) {
	const status = postStatus(post);
	if (status === "Published") return "bg-emerald-100 text-emerald-700";
	if (status === "Submitted for Review") return "bg-sky-100 text-sky-700";
	if (status === "Rejected") return "bg-red-100 text-red-700";
	return "bg-amber-100 text-amber-700";
}

const publishedCount = computed(() => posts.value.filter((post) => postStatus(post) === "Published").length);
const draftCount = computed(() => posts.value.filter((post) => postStatus(post) === "Draft").length);
const reviewCount = computed(
	() => posts.value.filter((post) => postStatus(post) === "Submitted for Review").length,
);

const filteredPosts = computed(() => {
	const normalizedQuery = searchQuery.value.trim().toLowerCase();

	return posts.value.filter((post) => {
		const matchesFilter =
			activeFilter.value === "all" ||
			(activeFilter.value === "published" && postStatus(post) === "Published") ||
			(activeFilter.value === "drafts" && postStatus(post) === "Draft") ||
			(activeFilter.value === "review" && postStatus(post) === "Submitted for Review");

		if (!matchesFilter) return false;
		if (!normalizedQuery) return true;

		const haystack = [post.title, post.blog_category, post.blog_intro]
			.filter(Boolean)
			.join(" ")
			.toLowerCase();

		return haystack.includes(normalizedQuery);
	});
});

function primaryActionLink(post) {
	if (postStatus(post) === "Published") {
		return { name: "PostDetail", params: { name: post.name } };
	}

	return { name: "CreatePost", params: { name: post.name } };
}

function resetFilters() {
	activeFilter.value = "all";
	searchQuery.value = "";
}

async function fetchPosts() {
	loading.value = true;
	error.value = "";

	try {
		posts.value = await blogApi.getMyBlogs();
	} catch (err) {
		error.value = err.message || "Unable to load your blogs.";
		posts.value = [];
	} finally {
		loading.value = false;
	}
}

onMounted(fetchPosts);
</script>
