<template>
	<main class="min-h-screen bg-[#f6f3ee] selection:bg-[#b42318] selection:text-white overflow-y-auto">
		<div class="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-20">

			<!-- Header / Dashboard Hero -->
			<section class="relative overflow-hidden rounded-[2.5rem] bg-gray-900 text-white shadow-2xl">
				<!-- Background Texture & Decorative Gradients -->
				<div
					class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10">
				</div>
				<div class="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-[#b42318] opacity-10 blur-[100px]">
				</div>

				<div class="relative px-6 py-10 md:px-12 md:py-16">
					<div class="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
						<div class="max-w-3xl space-y-4">
							<p
								class="inline-block bg-[#b42318] px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.3em] text-white">
								Editorial Archive
							</p>
							<h1 class="editorial-display text-4xl font-black tracking-tight md:text-6xl">
								Your Publications<span class="text-[#b42318]">.</span>
							</h1>
							<p class="max-w-xl text-sm leading-relaxed text-white/60">
								Manage your literary portfolio. Track performance, refine drafts, and oversee the
								editorial lifecycle.
							</p>
						</div>

						<router-link to="/create-post"
							class="group flex items-center justify-center gap-3 bg-white px-8 py-4 text-[11px] font-black uppercase tracking-widest text-gray-900 transition-all hover:bg-[#b42318] hover:text-white">
							Write New Entry
							<span class="transition-transform group-hover:translate-x-1">→</span>
						</router-link>
					</div>

					<!-- Stats Mini-Grid -->
					<div class="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
						<div v-for="(val, label) in statsMap" :key="label"
							class="border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-colors hover:bg-white/10">
							<p class="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">{{ label }}</p>
							<p class="editorial-display mt-2 text-3xl font-bold text-white">{{ val }}</p>
						</div>
					</div>
				</div>
			</section>

			<!-- Control Bar: Search & Filters -->
			<section
				class="sticky top-6 z-30 mt-10 rounded-2xl border border-gray-900/5 bg-white/80 p-4 shadow-xl shadow-gray-200/50 backdrop-blur-xl md:p-6">
				<div class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
					<!-- Filter Tabs -->
					<div class="flex flex-wrap gap-1">
						<button v-for="option in filters" :key="option.value" @click="activeFilter = option.value"
							class="px-5 py-2 text-[10px] font-black uppercase tracking-widest transition-all" :class="activeFilter === option.value
								? 'bg-gray-900 text-white shadow-lg'
								: 'text-gray-400 hover:text-gray-900'">
							{{ option.label }}
						</button>
					</div>

					<!-- Search -->
					<div class="relative w-full max-w-md">
						<span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
							<svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24"
								stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="3"
									d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
							</svg>
						</span>
						<input v-model.trim="searchQuery" type="search" placeholder="Search archives..."
							class="w-full border-none bg-[#f6f3ee] py-3 pl-11 pr-4 text-xs font-bold uppercase tracking-widest text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#b42318]/20 transition-all outline-none" />
					</div>
				</div>
			</section>

			<!-- Loading State -->
			<div v-if="loading" class="flex flex-col items-center justify-center py-40">
				<div class="h-12 w-12 animate-spin rounded-full border-b-2 border-[#b42318]"></div>
				<p class="mt-6 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Syncing Archives</p>
			</div>

			<div
				v-else-if="error"
				class="surface mt-12 flex flex-col items-start gap-4 rounded-[2rem] px-6 py-8 md:px-8"
			>
				<p class="kicker text-[11px]">Could Not Load</p>
				<h2 class="editorial-display text-3xl font-black text-gray-900">Your archive is unavailable.</h2>
				<p class="max-w-2xl text-sm leading-6 text-gray-600">{{ error }}</p>
				<button class="btn-primary" type="button" @click="fetchPosts">Try again</button>
			</div>

			<!-- Blog Grid -->
				<div v-else-if="filteredPosts.length" class="mt-12 grid grid-cols-1 gap-10 xl:grid-cols-2">
					<AuthorPostCard
						v-for="post in filteredPosts"
						:key="post.name"
						:post="post"
						:edit-to="primaryActionLink(post)"
						:view-to="viewPostLink(post)"
						:edit-label="primaryActionLabel(post)"
						:show-delete="canDeletePost(post)"
						:deleting="deletingPostName === post.name"
						@delete="deletePost(post)"
					/>
				</div>

			<!-- Empty State -->
			<div v-else
				class="mt-12 overflow-hidden rounded-[2.5rem] border-2 border-dashed border-gray-200 bg-white/50 py-24 text-center">
				<div
					class="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-xl text-3xl">
					{{ posts.length ? '🔍' : '📁' }}
				</div>
				<h2 class="editorial-display text-3xl font-bold text-gray-900">
					{{ posts.length ? "No Matching Records" : "Archive is Empty" }}
				</h2>
				<p class="mx-auto mt-4 max-w-sm text-sm text-gray-500">
					{{ posts.length ? "Adjust your search parameters or clear filters." : "You haven't authored any publications yet." }}
				</p>
				<div class="mt-10 flex flex-wrap justify-center gap-4">
					<button v-if="posts.length" @click="resetFilters"
						class="border-b-2 border-gray-900 pb-1 text-[10px] font-black uppercase tracking-widest text-gray-900">
						Reset Filters
					</button>
					<router-link to="/create-post"
						class="bg-[#b42318] px-8 py-3 text-[10px] font-black uppercase tracking-widest text-white shadow-xl">
						Write First Post
					</router-link>
				</div>
			</div>
		</div>
	</main>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { blogApi } from "../api/blogServices";
import { siteApi } from "../api/siteServices";
import AuthorPostCard from "../components/AuthorPostCard.vue";

const posts = ref([]);
const loading = ref(true);
const error = ref("");
const activeFilter = ref("all");
const searchQuery = ref("");
const deletingPostName = ref("");
const userRoles = ref([]);

const filters = [
	{ label: "All Works", value: "all" },
	{ label: "Published", value: "published" },
	{ label: "Drafts", value: "drafts" },
	{ label: "In Review", value: "review" },
];

function postStatus(post) {
	return post.custom_post_status || (post.published ? "Published" : "Draft");
}

const isSystemManager = computed(() => userRoles.value.includes("System Manager"));

const publishedCount = computed(() => posts.value.filter((p) => postStatus(p) === "Published").length);
const draftCount = computed(() => posts.value.filter((p) => postStatus(p) === "Draft").length);
const reviewCount = computed(() => posts.value.filter((p) => postStatus(p) === "Submitted for Review").length);

const statsMap = computed(() => ({
	'Total Assets': posts.value.length,
	'Live on Site': publishedCount.value,
	'In Progress': draftCount.value,
	'Editorial Review': reviewCount.value
}));

const filteredPosts = computed(() => {
	const query = searchQuery.value.toLowerCase();
	return posts.value.filter((post) => {
		const matchesFilter = activeFilter.value === "all" ||
			(activeFilter.value === "published" && postStatus(post) === "Published") ||
			(activeFilter.value === "drafts" && postStatus(post) === "Draft") ||
			(activeFilter.value === "review" && postStatus(post) === "Submitted for Review");

		const haystack = `${post.title} ${post.blog_category} ${post.blog_intro}`.toLowerCase();
		return matchesFilter && haystack.includes(query);
	});
});

function canEditInWebsiteEditor(post) {
	return !post?.published || isSystemManager.value;
}

function canDeletePost(post) {
	return !post?.published;
}

function primaryActionLink(post) {
	return canEditInWebsiteEditor(post)
		? { name: "CreatePost", params: { name: post.name } }
		: viewPostLink(post);
}

function viewPostLink(post) { return { name: "PostDetail", params: { name: post.name } }; }

function primaryActionLabel(post) {
	if (postStatus(post) === "Published" && !canEditInWebsiteEditor(post)) return "View published blog";
	if (postStatus(post) === "Published") return "Edit published blog";
	if (postStatus(post) === "Submitted for Review") return "Edit submission";
	return "Edit draft";
}

function resetFilters() {
	activeFilter.value = "all";
	searchQuery.value = "";
}

async function fetchPosts() {
	loading.value = true;
	error.value = "";
	try {
		const [blogs, roles] = await Promise.all([
			blogApi.getMyBlogs(),
			siteApi.getCurrentUserRoles().catch(() => []),
		]);
		posts.value = blogs;
		userRoles.value = Array.isArray(roles) ? roles : [];
	} catch (err) {
		error.value = err.message || "Archive unavailable.";
		posts.value = [];
		userRoles.value = [];
	} finally {
		loading.value = false;
	}
}

async function deletePost(post) {
	if (!window.confirm(`Permanently remove "${post.title}"?`)) return;
	deletingPostName.value = post.name;
	try {
		await blogApi.deleteMyPendingPost(post.name);
		posts.value = posts.value.filter((item) => item.name !== post.name);
	} catch (err) {
		console.error(err);
	} finally {
		deletingPostName.value = "";
	}
}

onMounted(fetchPosts);
</script>

<style scoped>
main {
	overflow-y: auto;
	scroll-behavior: smooth;
}

.editorial-display {
	font-smoothing: antialiased;
	-webkit-font-smoothing: antialiased;
}
</style>
