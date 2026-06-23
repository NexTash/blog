<template>
	<main class="min-h-screen bg-[#f6f3ee] px-4 py-12">
		<div class="mx-auto max-w-7xl">
			<!-- Page header -->
			<div class="mb-8 border-b border-gray-200 pb-6">
				<p class="kicker">Category</p>
				<h1 class="section-heading mt-2">{{ categoryTitle }}</h1>
				<p v-if="posts.length" class="mt-2 text-sm text-gray-500">
					{{ posts.length }} {{ posts.length === 1 ? "story" : "stories" }} found
				</p>
			</div>

			<!-- Posts grid -->
			<div v-if="loading" class="flex flex-col items-center justify-center py-24">
				<div class="h-10 w-10 animate-spin rounded-full border-b-2 border-[#b42318]"></div>
				<p class="mt-4 text-sm font-medium text-gray-400">Loading...</p>
			</div>

			<div
				v-else-if="posts.length"
				class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
			>
				<article
					v-for="post in posts"
					:key="post.name"
					class="surface group overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_60px_rgba(15,23,42,0.14)]"
				>
					<!-- Thumbnail -->
					<div class="relative h-52 overflow-hidden bg-gray-900">
						<img
							:src="getImageUrl(post.meta_image)"
							:alt="post.title"
							class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
						/>
						<div class="absolute left-4 top-4">
							<span class="story-chip">
								{{ post.blog_category || "General" }}
							</span>
						</div>
					</div>

					<!-- Card body -->
					<div class="flex min-h-[220px] flex-col p-6">
						<router-link :to="{ name: 'PostDetail', params: { name: post.name } }">
							<h3
								class="line-clamp-2 text-xl font-black leading-tight text-gray-900 transition-colors group-hover:text-[#b42318]"
							>
								{{ post.title }}
							</h3>
						</router-link>

						<div
							class="mt-3 text-[11px] font-bold uppercase tracking-[0.14em] text-gray-400"
						>
							{{ formatDate(post.published_on) }}
							<span class="mx-1">/</span>
							{{ post.blogger || "Admin" }}
						</div>

						<p
							v-if="post.blog_intro"
							class="mt-4 line-clamp-3 text-sm leading-6 text-gray-600"
						>
							{{ post.blog_intro }}
						</p>

						<router-link
							:to="{ name: 'PostDetail', params: { name: post.name } }"
							class="mt-auto inline-flex items-center gap-1 pt-5 text-xs font-black uppercase tracking-[0.16em] text-gray-900 transition-colors hover:text-[#b42318]"
						>
							Read Story <span aria-hidden="true">→</span>
						</router-link>
					</div>
				</article>
			</div>

			<!-- Empty state -->
			<div
				v-else
				class="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white py-24 text-center"
			>
				<svg
					class="mb-4 h-12 w-12 text-gray-300"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="1.5"
						d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
					/>
				</svg>
				<p class="text-lg font-bold text-gray-400">No stories in this category yet.</p>
				<router-link
					to="/"
					class="mt-4 text-xs font-black uppercase tracking-[0.16em] text-[#b42318] hover:underline"
				>
					← Browse all stories
				</router-link>
			</div>
		</div>
	</main>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { blogsResource, categoriesResource } from "../api/blogServices.js";
import { getImageUrl, formatDate } from "../utils/post";

const route = useRoute();

onMounted(() => {
	blogsResource.fetch();
	categoriesResource.fetch();
});

const categoryTitle = computed(() => {
	const cat = (categoriesResource.data || []).find((c) => c.name === route.params.slug);
	return cat ? cat.title || cat.name : route.params.slug;
});

const loading = computed(() => blogsResource.loading);

const posts = computed(() => {
	const all = blogsResource.data || [];
	return all.filter((p) => p.blog_category === route.params.slug);
});
</script>
