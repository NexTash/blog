<template>
	<section id="all-stories" class="bg-white px-4 py-12 md:py-16">
		<div class="mx-auto max-w-7xl">
			<div class="mb-8 flex flex-col justify-between gap-3 border-b border-gray-200 pb-5 md:flex-row md:items-end">
				<div>
					<p class="kicker">Browse</p>
					<h2 class="section-heading mt-2">All Stories</h2>
				</div>
				<p class="max-w-xl text-sm leading-6 text-gray-500">
					Explore the complete feed with clear categories, readable summaries, and consistent article cards.
				</p>
			</div>

			<div v-if="posts && posts.length > 0" class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
				<article
					v-for="post in posts"
					:key="post.name"
					class="surface group overflow-hidden transition-all duration-300 hover:-trangray-y-1 hover:shadow-[0_22px_60px_rgba(15,23,42,0.14)]"
				>
					<!-- Thumbnail -->
					<div class="relative h-56 overflow-hidden bg-gray-900">
						<img
							:src="getImageUrl(post.meta_image)"
							:alt="post.title"
							class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
						/>
						<div class="absolute left-4 top-4">
							<span
								v-for="cat in getCategories(post).slice(0, 1)"
								:key="cat"
								class="story-chip"
							>
								{{ cat }}
							</span>
						</div>
					</div>

					<!-- Card body -->
					<div class="flex min-h-[240px] flex-col p-6">
						<router-link :to="{ name: 'PostDetail', params: { name: post.name } }">
							<h3 class="line-clamp-2 text-xl font-black leading-tight text-gray-900 transition-colors group-hover:text-[#b42318]">
								{{ post.title }}
							</h3>
						</router-link>

						<div class="mt-3 text-[11px] font-bold uppercase tracking-[0.14em] text-gray-400">
							{{ formatDate(post.published_on, { year: "numeric", month: "long", day: "numeric" }) }}
							<span class="mx-1">/</span>
							{{ post.blogger || "Admin" }}
						</div>

						<p class="mt-4 line-clamp-3 text-sm leading-6 text-gray-600">
							{{ stripHtml(post.blog_intro || post.content) }}
						</p>

						<router-link
							:to="{ name: 'PostDetail', params: { name: post.name } }"
							class="mt-auto inline-flex items-center gap-1 pt-6 text-xs font-black uppercase tracking-[0.16em] text-gray-900 transition-colors hover:text-[#b42318]"
						>
							Read Story
							<span aria-hidden="true">→</span>
						</router-link>
					</div>
				</article>
			</div>

			<!-- Loading state -->
			<div v-else class="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 py-20">
				<div class="mb-4 h-10 w-10 animate-spin rounded-full border-b-2 border-[#b42318]"></div>
				<p class="font-medium text-gray-500">Loading stories...</p>
			</div>
		</div>
	</section>
</template>

<script setup>
import { getImageUrl, stripHtml, formatDate } from "../utils/post";

const props = defineProps({
	posts: { type: Array, default: () => [] },
});

const getCategories = (post) => {
	if (!post.blog_category) return ["Uncategorized"];
	if (typeof post.blog_category === "string") return post.blog_category.split(",").map((c) => c.trim());
	return [post.blog_category];
};
</script>
