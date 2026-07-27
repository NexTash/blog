<template>
	<section id="all-stories" class="bg-white px-4 py-12 md:py-8">
		<div class="mx-auto max-w-7xl">
			<div
				class="mb-8 flex flex-col justify-between gap-3 border-b border-gray-200 pb-5 md:flex-row md:items-end">
				<div>
					<p class="kicker">Browse</p>
					<h2 class="section-heading mt-2">All Blogs</h2>
				</div>
				<p class="max-w-xl text-sm leading-6 text-gray-500">
					All our posts in one place, sorted by topic.
				</p>
			</div>

			<div v-if="posts && posts.length > 0" class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				<article v-for="post in visiblePosts" :key="post.name"
					class="surface group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_60px_rgba(15,23,42,0.14)]">
					<!-- Thumbnail -->
					<div class="relative h-56 overflow-hidden bg-gray-900">
						<img :src="getImageUrl(post.meta_image)" :alt="post.title"
							class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
						<div
							class="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 transition-opacity group-hover:opacity-100">
						</div>
						<div class="absolute left-4 top-4">
							<router-link v-if="post.blog_category"
								:to="{ name: 'Category', params: { slug: post.blog_category } }"
								class="story-chip transition-transform hover:scale-105">
								{{ getCategories(post)[0] }}
							</router-link>
							<span v-else class="story-chip">General</span>
						</div>
					</div>

					<!-- Card body -->
					<div class="flex min-h-[240px] flex-col p-6">
						<router-link :to="{ name: 'PostDetail', params: { name: post.name } }">
							<h3
								class="line-clamp-2 text-xl font-black leading-tight text-gray-900 transition-colors group-hover:text-[#b42318]">
								{{ post.title }}
							</h3>
						</router-link>

						<div
							class="mt-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-gray-400">
							<span>{{
								formatDate(post.published_on, {
									year: "numeric",
									month: "long",
									day: "numeric",
								})
							}}</span>
							<span class="text-gray-300">/</span>
							<span>{{ post.blogger || "Admin" }}</span>
						</div>

						<p class="mt-4 line-clamp-3 text-sm leading-6 text-gray-600">
							{{ stripHtml(post.blog_intro || post.content) }}
						</p>

						<router-link :to="{ name: 'PostDetail', params: { name: post.name } }"
							class="mt-auto inline-flex items-center gap-1.5 pt-6 text-xs font-black uppercase tracking-[0.16em] text-gray-900 transition-colors hover:text-[#b42318]">
							Read More
							<svg class="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" fill="none"
								viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
								<path stroke-linecap="round" stroke-linejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
							</svg>
						</router-link>
					</div>
				</article>
			</div>

			<!-- Load More -->
			<div v-if="posts && posts.length > visibleCount" class="mt-10 flex justify-center">
				<button @click="loadMore" class="btn-secondary gap-2">
					<svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
						<path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
					</svg>
					Load More Blogs
				</button>
			</div>

			<!-- Empty state -->
			<div v-else-if="!posts || posts.length === 0"
				class="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 py-20">
				<p class="font-medium text-gray-500">No stories available yet.</p>
			</div>
		</div>
	</section>
</template>

<script setup>
import { ref, computed } from "vue";
import { getImageUrl, stripHtml, formatDate } from "../utils/post";

const props = defineProps({
	posts: { type: Array, default: () => [] },
});

const visibleCount = ref(6);

const visiblePosts = computed(() => (props.posts || []).slice(0, visibleCount.value));

const loadMore = () => {
	visibleCount.value += 6;
};

const getCategories = (post) => {
	if (!post.blog_category) return ["Uncategorized"];
	if (typeof post.blog_category === "string")
		return post.blog_category.split(",").map((c) => c.trim());
	return [post.blog_category];
};
</script>
