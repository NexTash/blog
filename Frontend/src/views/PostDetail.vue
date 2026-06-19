<template>
	<main class="min-h-screen bg-white">
		<!-- Breadcrumb -->
		<div class="border-b border-gray-200 bg-[#f6f3ee] px-4 py-3">
			<div class="mx-auto max-w-4xl">
				<nav class="flex items-center gap-2 text-sm font-bold" aria-label="Breadcrumb">
					<router-link to="/" class="text-[#b42318] transition-colors hover:underline">Home</router-link>
					<span class="text-gray-300" aria-hidden="true">/</span>
					<span v-if="currentPost" class="truncate text-gray-600">{{ currentPost.title }}</span>
					<span v-else class="text-gray-400">Loading...</span>
				</nav>
			</div>
		</div>

		<div class="mx-auto max-w-4xl px-4 py-10 md:px-6 md:py-14">
			<!-- Loading spinner -->
			<div v-if="blogs.loading" class="flex flex-col items-center justify-center py-24">
				<div class="h-10 w-10 animate-spin rounded-full border-b-2 border-[#b42318]"></div>
			</div>

			<!-- Article -->
			<article v-else-if="currentPost">
				<!-- Category tag -->
				<router-link
					v-if="currentPost.blog_category"
					:to="{ name: 'Category', params: { slug: currentPost.blog_category } }"
					class="kicker transition-colors hover:underline"
				>
					{{ currentPost.blog_category }}
				</router-link>
				<span v-else class="kicker">Uncategorized</span>

				<!-- Title -->
				<h1 class="mt-4 text-4xl font-black leading-tight tracking-tight text-gray-900 md:text-5xl">
					{{ currentPost.title }}
				</h1>

				<!-- Meta -->
				<div class="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-bold uppercase tracking-[0.14em] text-gray-400">
					<span>{{ formatDate(currentPost.published_on, { month: "long", day: "numeric", year: "numeric" }) }}</span>
					<span aria-hidden="true" class="text-gray-300">|</span>
					<span>{{ currentPost.blogger || "Theme Admin" }}</span>
				</div>

				<!-- Hero image -->
				<div class="my-10 overflow-hidden rounded-lg bg-gray-100 shadow-[0_22px_60px_rgba(15,23,42,0.14)]">
					<img
						:src="getImageUrl(currentPost.meta_image)"
						:alt="currentPost.title"
						class="max-h-[520px] w-full object-cover"
					/>
				</div>

				<!-- Intro / pull quote -->
				<p
					v-if="currentPost.blog_intro"
					class="rounded-r-lg border-l-4 border-[#b42318] bg-[#fff4f1] py-4 pl-5 pr-4 text-xl leading-8 text-gray-700 md:text-2xl"
				>
					{{ currentPost.blog_intro }}
				</p>

				<hr v-if="currentPost.blog_intro" class="my-10 border-gray-200" />

				<!-- Body content — sanitized server-side by Frappe -->
				<!-- eslint-disable-next-line vue/no-v-html -->
				<div class="article-content" v-html="currentPost.content"></div>

				<!-- Back button -->
				<div class="mt-14 border-t border-gray-200 pt-8">
					<button
						@click="$router.back()"
						class="text-xs font-black uppercase tracking-[0.16em] text-gray-400 transition-colors hover:text-[#b42318]"
					>
						← Back to Stories
					</button>
				</div>
			</article>

			<!-- Not found state -->
			<div v-else class="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 py-24 text-center">
				<svg class="mb-4 h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
				</svg>
				<p class="text-xl font-bold text-gray-500">Post not found.</p>
				<button
					@click="$router.push('/')"
					class="mt-4 text-sm font-bold uppercase tracking-[0.16em] text-[#b42318] hover:underline"
				>
					Go Home
				</button>
			</div>
		</div>
	</main>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { blogsResource } from "../api/blogServices.js";
import { getImageUrl, formatDate } from "../utils/post";

const route = useRoute();
const blogs = blogsResource;

const currentPost = computed(() => blogs.data.find((p) => p.name === route.params.name));

onMounted(() => {
	if (blogs.data.length === 0) blogs.fetch();
});
</script>

<style>
.article-content {
	font-size: 1.0625rem;
	line-height: 1.85;
	color: #334155;
}

.article-content h1,
.article-content h2,
.article-content h3,
.article-content h4 {
	margin-top: 2rem;
	margin-bottom: 0.75rem;
	font-weight: 900;
	line-height: 1.25;
	color: #020617;
}

.article-content h1 { font-size: 2rem; }
.article-content h2 { font-size: 1.625rem; }
.article-content h3 { font-size: 1.375rem; }
.article-content h4 { font-size: 1.125rem; }

.article-content p { margin: 1.25rem 0; }

.article-content a {
	color: #b42318;
	text-decoration: underline;
	text-underline-offset: 3px;
}

.article-content a:hover { color: #971b12; }

.article-content img {
	margin: 2rem 0;
	max-width: 100%;
	border-radius: 0.5rem;
}

.article-content blockquote {
	margin: 1.5rem 0;
	padding-left: 1.25rem;
	border-left: 4px solid #b42318;
	color: #475569;
	font-style: italic;
}

.article-content ul,
.article-content ol {
	margin: 1rem 0;
	padding-left: 1.5rem;
}

.article-content ul { list-style-type: disc; }
.article-content ol { list-style-type: decimal; }
.article-content li { margin: 0.4rem 0; }

.article-content code {
	background: #f1f5f9;
	padding: 0.15em 0.4em;
	border-radius: 3px;
	font-size: 0.9em;
	font-family: ui-monospace, monospace;
}

.article-content pre {
	background: #1e293b;
	color: #e2e8f0;
	padding: 1.25rem;
	overflow-x: auto;
	margin: 1.5rem 0;
}

.article-content pre code {
	background: none;
	padding: 0;
	color: inherit;
}

.article-content table {
	width: 100%;
	border-collapse: collapse;
	margin: 1.5rem 0;
	font-size: 0.925rem;
}

.article-content th,
.article-content td {
	border: 1px solid #e2e8f0;
	padding: 0.6rem 0.9rem;
	text-align: left;
}

.article-content th {
	background: #f8fafc;
	font-weight: 700;
}
</style>
