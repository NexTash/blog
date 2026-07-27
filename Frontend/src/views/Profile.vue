<template>
	<main class="min-h-screen bg-[#f6f3ee] px-4 py-12 md:px-8 md:py-16 selection:bg-[#b42318] selection:text-white">
		<div class="mx-auto max-w-6xl">
			<!-- Page Header -->
			<header class="mb-10 md:mb-14">
				<p class="kicker text-[11px] font-bold uppercase tracking-[0.2em] text-[#b42318]">Profile</p>
				<h1
					class="section-heading editorial-display mt-3 text-4xl font-black tracking-tight text-gray-900 md:text-5xl">
					Your Author Profile
				</h1>
				<p class="mt-4 max-w-2xl text-base leading-relaxed text-gray-600">
					Review your account details, publishing activity, and latest blogs from one centralized dashboard.
				</p>
			</header>

			<!-- Loading State -->
			<div v-if="loading" class="flex flex-col items-center justify-center py-32">
				<div class="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-[#b42318]"></div>
				<p class="mt-6 text-sm font-medium tracking-wide text-gray-500 uppercase">Loading profile...</p>
			</div>

			<!-- Error State -->
			<div v-else-if="error"
				class="surface flex flex-col items-start gap-5 rounded-2xl border border-red-100 bg-white p-8 shadow-sm md:p-12">
				<p class="kicker text-red-600">Could Not Load</p>
				<h2 class="editorial-display text-3xl font-black tracking-tight text-gray-900">
					We could not load your profile right now.
				</h2>
				<p class="text-base leading-relaxed text-gray-600">{{ error }}</p>
				<button class="btn-primary mt-2" type="button" @click="fetchProfile">Try again</button>
			</div>

			<!-- Profile Content -->
			<div v-else-if="profile" class="space-y-10">
				<!-- Hero Section -->
				<section
					class="surface relative overflow-hidden rounded-3xl border border-gray-900 bg-gradient-to-br from-gray-900 via-gray-800 to-[#4a1515] text-white shadow-xl shadow-gray-900/10">
					<!-- Decorative subtle grain/pattern overlay (optional visual enhancement) -->
					<div
						class="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] opacity-20 mix-blend-overlay">
					</div>

					<div class="relative grid gap-8 px-6 py-8 md:grid-cols-[1.3fr_0.7fr] md:px-10 md:py-12 lg:gap-16">
						<!-- Author Info -->
						<div class="flex flex-col gap-6 sm:flex-row sm:items-start">
							<div
								class="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-white/20 bg-white/10 text-4xl font-black uppercase shadow-inner">
								<img v-if="avatarUrl" :src="avatarUrl" :alt="displayName"
									class="h-full w-full object-cover" />
								<span v-else>{{ initial }}</span>
							</div>

							<div class="min-w-0 flex-1">
								<p class="text-[10px] font-black uppercase tracking-[0.25em] text-[#fca5a5]">
									Author Account
								</p>
								<h2 class="editorial-display mt-2 text-3xl font-black tracking-tight sm:text-4xl">
									{{ displayName }}
								</h2>
								<p class="mt-2 text-sm font-medium text-white/60">
									{{ profile.user.email }}
								</p>

								<div class="mt-5 flex flex-wrap gap-2">
									<span v-for="role in visibleRoles" :key="role"
										class="rounded-full border border-white/20 bg-white/5 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-white/90 backdrop-blur-sm">
										{{ role }}
									</span>
								</div>

								<p class="mt-6 max-w-xl text-sm leading-relaxed text-white/80">
									{{ bioText }}
								</p>
							</div>
						</div>

						<!-- Stats Grid -->
						<div class="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-2">
							<div
								class="group flex flex-col justify-center rounded-2xl border border-white/10 bg-white/5 p-5 transition-colors hover:bg-white/10">
								<p class="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">Total</p>
								<p
									class="editorial-display mt-2 text-4xl font-black text-white group-hover:text-[#fca5a5] transition-colors">
									{{ profile.stats.total_posts }}</p>
							</div>
							<div
								class="group flex flex-col justify-center rounded-2xl border border-white/10 bg-white/5 p-5 transition-colors hover:bg-white/10">
								<p class="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">Published</p>
								<p
									class="editorial-display mt-2 text-4xl font-black text-white group-hover:text-[#fca5a5] transition-colors">
									{{ profile.stats.published_posts }}</p>
							</div>
							<div
								class="group flex flex-col justify-center rounded-2xl border border-white/10 bg-white/5 p-5 transition-colors hover:bg-white/10">
								<p class="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">Drafts</p>
								<p
									class="editorial-display mt-2 text-4xl font-black text-white group-hover:text-[#fca5a5] transition-colors">
									{{ profile.stats.draft_posts }}</p>
							</div>
							<div
								class="group flex flex-col justify-center rounded-2xl border border-white/10 bg-white/5 p-5 transition-colors hover:bg-white/10">
								<p class="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">In Review</p>
								<p
									class="editorial-display mt-2 text-4xl font-black text-white group-hover:text-[#fca5a5] transition-colors">
									{{ profile.stats.review_posts }}</p>
							</div>
						</div>
					</div>
				</section>

				<!-- Two Column Layout for Content -->
				<div class="grid gap-8 lg:grid-cols-[1.5fr_0.8fr] lg:gap-12">
					<!-- Left Column: Recent Blogs -->
					<section class="surface rounded-3xl border border-[#e8e4db] bg-white p-6 shadow-sm md:p-10">
						<div
							class="flex flex-col gap-4 border-b border-gray-100 pb-6 sm:flex-row sm:items-end sm:justify-between">
							<div>
								<p class="kicker text-[10px] font-bold uppercase tracking-[0.2em] text-[#b42318]">Recent
									Work</p>
								<h2
									class="editorial-display mt-2 text-2xl font-black tracking-tight text-gray-900 md:text-3xl">
									Latest Blogs
								</h2>
							</div>
							<router-link to="/my-blogs" class="btn-secondary whitespace-nowrap text-sm">
								View all blogs
							</router-link>
						</div>

						<!-- Blogs List -->
						<div v-if="profile.recent_posts.length" class="divide-y divide-gray-100">
							<article v-for="post in profile.recent_posts" :key="post.name"
								class="group flex flex-col gap-5 py-8 transition-all sm:flex-row sm:items-start sm:justify-between">
								<div class="min-w-0 flex-1">
									<div class="flex flex-wrap items-center gap-3">
										<span
											class="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em]"
											:class="statusBadgeClass(post)">
											{{ postStatus(post) }}
										</span>
										<span class="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">
											{{ post.blog_category || "Uncategorized" }}
										</span>
									</div>
									<router-link :to="postLink(post)" class="block mt-4">
										<h3
											class="editorial-display text-xl font-black leading-tight text-gray-900 decoration-[#b42318] decoration-2 underline-offset-4 group-hover:underline md:text-2xl">
											{{ post.title }}
										</h3>
									</router-link>
									<p v-if="post.blog_intro"
										class="mt-3 line-clamp-2 text-sm leading-relaxed text-gray-600">
										{{ post.blog_intro }}
									</p>
									<p class="mt-4 text-[11px] font-bold uppercase tracking-[0.1em] text-gray-400">
										{{ postStatus(post) === "Published" ? "Published" : "Updated" }}
										{{ formatDate(post.published ? post.published_on : post.modified) }}
									</p>
								</div>

								<router-link :to="postLink(post)"
									class="btn-secondary mt-2 w-full justify-center shrink-0 opacity-100 transition-opacity sm:mt-0 sm:w-auto lg:opacity-0 lg:group-hover:opacity-100">
									{{
										postStatus(post) === "Published"
											? "Edit published blog"
											: postStatus(post) === "Submitted for Review"
												? "Edit submission"
												: "Edit draft"
									}}
								</router-link>
							</article>
						</div>

						<!-- Empty State -->
						<div v-else
							class="mt-8 flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#d2cbc0] bg-[#faf8f5] px-6 py-16 text-center">
							<div
								class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#f6f3ee] text-2xl text-gray-400">
								✍️
							</div>
							<p class="editorial-display text-xl font-black tracking-tight text-gray-900">No blogs yet
							</p>
							<p class="mt-2 max-w-sm text-sm leading-relaxed text-gray-500">
								Start your first draft. Your published work and works-in-progress will appear here.
							</p>
							<router-link to="/create-post" class="btn-primary mt-6">
								Write a blog
							</router-link>
						</div>
					</section>

					<!-- Right Column: Sidebar -->
					<aside class="space-y-8">
						<!-- Quick Actions -->
						<section class="surface rounded-3xl border border-[#e8e4db] bg-white p-6 shadow-sm md:p-8">
							<p class="kicker text-[10px] font-bold uppercase tracking-[0.2em] text-[#b42318]">Publishing
							</p>
							<h2 class="editorial-display mt-2 text-xl font-black text-gray-900">Quick Actions</h2>
							<div class="mt-6 flex flex-col gap-3">
								<router-link to="/create-post" class="btn-primary flex justify-center py-3">
									Write New Blog
								</router-link>
								<router-link to="/my-blogs" class="btn-secondary flex justify-center py-3">
									Manage Content
								</router-link>
							</div>
						</section>

						<!-- Account Snapshot -->
						<section class="surface rounded-3xl border border-[#e8e4db] bg-[#faf8f5] p-6 shadow-sm md:p-8">
							<p class="kicker text-[10px] font-bold uppercase tracking-[0.2em] text-[#b42318]">Identity
							</p>
							<h2 class="editorial-display mt-2 text-xl font-black text-gray-900">Account Snapshot</h2>
							<div class="mt-6 space-y-4">
								<div
									class="rounded-xl border border-[#e8e4db] bg-white p-4 transition-shadow hover:shadow-sm">
									<p class="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">
										Short Name
									</p>
									<p class="mt-1 text-sm font-semibold text-gray-900">
										{{ profile.blogger.short_name || initial }}
									</p>
								</div>
								<div
									class="rounded-xl border border-[#e8e4db] bg-white p-4 transition-shadow hover:shadow-sm">
									<p class="text-[10px] font-bold uppercase tracking-[0.15em] text-gray-400">
										Blogger Profile
									</p>
									<p class="mt-1 truncate text-sm font-semibold text-gray-900">
										{{ profile.blogger.name || "Not linked yet" }}
									</p>
								</div>
							</div>
						</section>
					</aside>
				</div>
			</div>
		</div>
	</main>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { siteApi } from "../api/siteServices";
import { formatDate } from "../utils/post";

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
const visibleRoles = computed(() => (profile.value?.roles || []).slice(0, 4));
const avatarUrl = computed(() => {
	const rawUrl = profile.value?.blogger?.avatar || profile.value?.user?.user_image || "";
	if (!rawUrl) return "";
	return rawUrl.startsWith("/") ? `${window.location.origin}${rawUrl}` : rawUrl;
});

function postLink(post) {
	return { name: "CreatePost", params: { name: post.name } };
}

function postStatus(post) {
	return post.custom_post_status || (post.published ? "Published" : "Draft");
}

function statusBadgeClass(post) {
	const status = postStatus(post);
	if (status === "Published") return "bg-emerald-50 text-emerald-700 border border-emerald-200";
	if (status === "Submitted for Review") return "bg-sky-50 text-sky-700 border border-sky-200";
	if (status === "Rejected") return "bg-red-50 text-red-700 border border-red-200";
	return "bg-amber-50 text-amber-700 border border-amber-200";
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
