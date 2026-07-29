<template>
	<main class="min-h-screen bg-[#f6f3ee] selection:bg-[#b42318] selection:text-white">
		<!-- Main Content Wrapper -->
		<div class="mx-auto max-w-6xl px-4 py-12 md:px-8 md:py-20">
			
			<!-- Page Header: More Editorial/Newspaper style -->
			<header class="mb-12 border-b border-gray-900/10 pb-10">
				<div class="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
					<div class="space-y-2">
						<p class="inline-block bg-[#b42318] px-2 py-0.5 text-[10px] font-black uppercase tracking-[0.2em] text-white">
							Contributor Portal
						</p>
						<h1 class="editorial-display text-5xl font-black tracking-tight text-gray-900 md:text-6xl">
							Profile<span class="text-[#b42318]">.</span>
						</h1>
					</div>
					<p class="max-w-xs text-sm font-medium leading-relaxed text-gray-500 italic">
						Reviewing account performance and editorial activity for the current period.
					</p>
				</div>
			</header>

			<!-- Loading State -->
			<div v-if="loading" class="flex flex-col items-center justify-center py-40">
				<div class="relative h-16 w-16">
					<div class="absolute inset-0 animate-ping rounded-full border-2 border-[#b42318] opacity-20"></div>
					<div class="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-[#b42318]"></div>
				</div>
				<p class="mt-8 text-[11px] font-black tracking-[0.3em] text-gray-400 uppercase">Synchronizing Data</p>
			</div>

			<!-- Error State -->
			<div v-else-if="error"
				class="rounded-3xl border-2 border-dashed border-red-200 bg-red-50/50 p-12 text-center">
				<div class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
					</svg>
				</div>
				<h2 class="editorial-display text-2xl font-bold text-gray-900">Connection Interrupted</h2>
				<p class="mt-2 text-gray-600">{{ error }}</p>
				<button @click="fetchProfile" class="mt-8 bg-gray-900 px-8 py-3 text-xs font-bold uppercase tracking-widest text-white hover:bg-[#b42318] transition-colors">
					Retry Connection
				</button>
			</div>

			<!-- Profile Content -->
			<div v-else-if="profile" class="grid gap-12">
				
				<!-- Hero: Author Identity Card -->
				<section class="group relative overflow-hidden rounded-[2rem] bg-gray-900 p-1 shadow-2xl transition-all duration-500 hover:shadow-[#b42318]/10">
					<div class="relative overflow-hidden rounded-[1.8rem] bg-gradient-to-br from-[#1a1a1a] via-[#111] to-[#2d0a0a] px-6 py-10 md:px-12 md:py-16">
						
						<!-- Decorative Elements -->
						<div class="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#b42318] opacity-10 blur-[80px] transition-opacity group-hover:opacity-20"></div>
						<div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>

						<div class="relative grid gap-12 lg:grid-cols-[1fr_auto]">
							<!-- Author Info -->
							<div class="flex flex-col gap-8 md:flex-row md:items-center">
								<div class="relative shrink-0">
									<div class="h-32 w-32 overflow-hidden rounded-2xl border-2 border-white/10 p-1 rotate-3 transition-transform group-hover:rotate-0">
										<img v-if="avatarUrl" :src="avatarUrl" :alt="displayName" class="h-full w-full rounded-xl object-cover" />
										<div v-else class="flex h-full w-full items-center justify-center bg-white/5 text-4xl font-black text-white">
											{{ initial }}
										</div>
									</div>
									<div class="absolute -bottom-2 -right-2 h-8 w-8 rounded-full border-4 border-[#111] bg-emerald-500"></div>
								</div>

								<div class="space-y-4">
									<div>
										<span class="text-[10px] font-bold uppercase tracking-[0.3em] text-[#b42318]">Verified Author</span>
										<h2 class="editorial-display mt-2 text-4xl font-black text-white md:text-5xl">
											{{ displayName }}
										</h2>
										<p class="mt-1 font-mono text-xs text-white/40">{{ profile.user.email }}</p>
									</div>
									<div class="flex flex-wrap gap-2">
										<span v-for="role in visibleRoles" :key="role" class="border border-white/10 bg-white/5 px-3 py-1 text-[9px] font-bold uppercase tracking-widest text-white/70 backdrop-blur-md">
											{{ role }}
										</span>
									</div>
									<p class="max-w-xl text-sm leading-relaxed text-white/60">
										{{ bioText }}
									</p>
								</div>
							</div>

							<!-- Stats Minimalist Grid -->
							<div class="grid grid-cols-2 gap-px overflow-hidden rounded-xl bg-white/10 border border-white/10 backdrop-blur-md">
								<div v-for="(val, label) in statsMap" :key="label" class="bg-[#111]/50 p-6 text-center transition-colors hover:bg-white/5">
									<p class="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">{{ label }}</p>
									<p class="editorial-display mt-2 text-3xl font-bold text-white">{{ val }}</p>
								</div>
							</div>
						</div>
					</div>
				</section>

				<div class="grid gap-12 lg:grid-cols-[1fr_320px]">
					<!-- Left Column: Content Stream -->
					<section class="space-y-8">
						<div class="flex items-center justify-between border-b border-gray-900/5 pb-4">
							<h3 class="text-xs font-black uppercase tracking-[0.3em] text-gray-900">Recent Contributions</h3>
							<router-link to="/my-blogs" class="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#b42318]">
								Archive
								<span class="transition-transform group-hover:translate-x-1">→</span>
							</router-link>
						</div>

						<div v-if="profile.recent_posts.length" class="grid gap-6">
							<AuthorPostCard
								v-for="post in profile.recent_posts"
								:key="post.name"
								:post="post"
								:edit-to="postLink(post)"
								:view-to="viewPostLink(post)"
								:edit-label="primaryActionLabel(post)"
								:compact="true"
							/>
						</div>

						<!-- Empty State -->
						<div v-else class="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 bg-white/50 py-20 text-center rounded-3xl">
							<span class="text-4xl opacity-20">✒️</span>
							<h3 class="editorial-display mt-4 text-xl font-bold text-gray-900">The desk is clear</h3>
							<p class="mt-2 text-sm text-gray-500">You haven't authored any publications yet.</p>
							<router-link to="/create-post" class="mt-6 border-b-2 border-[#b42318] pb-1 text-xs font-black uppercase tracking-widest text-gray-900 hover:text-[#b42318]">
								Start a new draft
							</router-link>
						</div>
					</section>

					<!-- Right Column: Metadata & Tools -->
					<aside class="space-y-10">
						<!-- Action Card -->
						<div class="rounded-3xl bg-[#b42318] p-8 text-white shadow-xl shadow-[#b42318]/20">
							<h3 class="editorial-display text-2xl font-bold">New Post</h3>
							<p class="mt-2 text-xs text-white/70 leading-relaxed">Ready to share a new perspective with the world?</p>
							<router-link to="/create-post" class="mt-6 flex w-full items-center justify-center bg-white py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-900 transition-transform hover:-translate-y-1">
								Create Draft
							</router-link>
						</div>

						<!-- Metadata Snapshot -->
						<div class="space-y-6">
							<h3 class="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Account Details</h3>
							<div class="divide-y divide-gray-900/5 rounded-2xl border border-gray-900/5 bg-white px-6">
								<div class="py-5">
									<p class="text-[9px] font-bold uppercase tracking-widest text-gray-400">Handle</p>
									<p class="mt-1 text-sm font-bold text-gray-900">{{ profile.blogger.short_name || 'N/A' }}</p>
								</div>
								<div class="py-5">
									<p class="text-[9px] font-bold uppercase tracking-widest text-gray-400">Profile Link</p>
									<p class="mt-1 truncate text-sm font-bold text-gray-900">{{ profile.blogger.name || "Pending Link" }}</p>
								</div>
								<div class="py-5">
									<p class="text-[9px] font-bold uppercase tracking-widest text-gray-400">System ID</p>
									<p class="mt-1 font-mono text-[10px] font-bold text-gray-400">{{ profile.user.name }}</p>
								</div>
							</div>
						</div>

						<!-- Quick Links -->
						<div class="rounded-2xl border border-gray-900/10 p-6">
							<nav class="flex flex-col gap-4">
								<router-link to="/my-blogs" class="text-[11px] font-bold uppercase tracking-widest text-gray-600 hover:text-[#b42318]">Editorial Manager</router-link>
								<a href="#" class="text-[11px] font-bold uppercase tracking-widest text-gray-400 hover:text-[#b42318]">Support Desk</a>
							</nav>
						</div>
					</aside>
				</div>
			</div>
		</div>
	</main>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import AuthorPostCard from "../components/AuthorPostCard.vue";
import { siteApi } from "../api/siteServices";

const loading = ref(true);
const error = ref("");
const profile = ref(null);

const displayName = computed(() => profile.value?.display_name || "Author");
const initial = computed(() => displayName.value.charAt(0).toUpperCase());
const bioText = computed(
	() =>
		profile.value?.blogger?.bio ||
		"This author account is ready to publish, edit, and manage blogs from the blog dashboard.",
);

const statsMap = computed(() => ({
	'Total': profile.value?.stats?.total_posts || 0,
	'Live': profile.value?.stats?.published_posts || 0,
	'Drafts': profile.value?.stats?.draft_posts || 0,
	'Review': profile.value?.stats?.review_posts || 0,
}));

const visibleRoles = computed(() => (profile.value?.roles || []).slice(0, 4));
const isSystemManager = computed(() => (profile.value?.roles || []).includes("System Manager"));
const avatarUrl = computed(() => {
	const rawUrl = profile.value?.blogger?.avatar || profile.value?.user?.user_image || "";
	if (!rawUrl) return "";
	return rawUrl.startsWith("/") ? `${window.location.origin}${rawUrl}` : rawUrl;
});

function postLink(post) {
	return canEditInWebsiteEditor(post)
		? { name: "CreatePost", params: { name: post.name } }
		: viewPostLink(post);
}

function viewPostLink(post) {
	return { name: "PostDetail", params: { name: post.name } };
}

function canEditInWebsiteEditor(post) {
	return !post?.published || isSystemManager.value;
}

function postStatus(post) {
	return post.custom_post_status || (post.published ? "Published" : "Draft");
}

function primaryActionLabel(post) {
	if (postStatus(post) === "Published" && !canEditInWebsiteEditor(post)) {
		return "View published blog";
	}
	if (postStatus(post) === "Published") return "Edit published blog";
	if (postStatus(post) === "Submitted for Review") return "Edit submission";
	return "Edit draft";
}

function statusBadgeClass(post) {
	const status = postStatus(post);
	if (status === "Published") return "bg-emerald-100 text-emerald-900";
	if (status === "Submitted for Review") return "bg-sky-100 text-sky-900";
	if (status === "Rejected") return "bg-red-100 text-red-900";
	return "bg-amber-100 text-amber-900";
}

async function fetchProfile() {
	loading.value = true;
	error.value = "";
	try {
		profile.value = await siteApi.getCurrentUserProfile();
	} catch (err) {
		error.value = err.message || "Unable to load your profile.";
		profile.value = null;
	} finally {
		loading.value = false;
	}
}

onMounted(fetchProfile);
</script>

<style scoped>
/* Ensuring smooth scrolling for the main container */
main {
	overflow-y: auto;
	scroll-behavior: smooth;
	-webkit-overflow-scrolling: touch;
}

/* Custom font smoothing for high-end editorial look */
.editorial-display {
	font-smoothing: antialiased;
	-webkit-font-smoothing: antialiased;
}
</style>
