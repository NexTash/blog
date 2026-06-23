<template>
	<main class="min-h-screen bg-white">
		<div class="border-b border-gray-200 bg-[#f6f3ee] px-4 py-3">
			<div class="mx-auto max-w-4xl">
				<nav class="flex items-center gap-2 text-sm font-bold" aria-label="Breadcrumb">
					<router-link to="/" class="text-[#b42318] transition-colors hover:underline"
						>Home</router-link
					>
					<span class="text-gray-300" aria-hidden="true">/</span>
					<span v-if="postData" class="truncate text-gray-600">{{
						postData.title
					}}</span>
					<span v-else class="text-gray-400">Loading...</span>
				</nav>
			</div>
		</div>

		<div class="mx-auto max-w-4xl px-4 py-10 md:px-6 md:py-14">
			<div v-if="loading" class="flex flex-col items-center justify-center py-24">
				<div class="h-10 w-10 animate-spin rounded-full border-b-2 border-[#b42318]"></div>
			</div>

			<article v-else-if="postData">
				<router-link
					v-if="postData.blog_category"
					:to="{ name: 'Category', params: { slug: postData.blog_category } }"
					class="kicker transition-colors hover:underline"
				>
					{{ postData.blog_category }}
				</router-link>
				<span v-else class="kicker">Uncategorized</span>

				<h1
					class="mt-4 text-4xl font-black leading-tight tracking-tight text-gray-900 md:text-5xl"
				>
					{{ postData.title }}
				</h1>

				<div
					class="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-bold uppercase tracking-[0.14em] text-gray-400"
				>
					<span>{{
						formatDate(postData.published_on, {
							month: "long",
							day: "numeric",
							year: "numeric",
						})
					}}</span>
					<span aria-hidden="true" class="text-gray-300">|</span>
					<span>{{ postData.blogger || "Theme Admin" }}</span>
				</div>

				<div
					class="my-10 overflow-hidden rounded-lg bg-gray-100 shadow-[0_22px_60px_rgba(15,23,42,0.14)]"
				>
					<img
						:src="getImageUrl(postData.meta_image)"
						:alt="postData.title"
						class="max-h-[520px] w-full object-cover"
					/>
				</div>

				<p
					v-if="postData.blog_intro"
					class="rounded-r-lg border-l-4 border-[#b42318] bg-[#fff4f1] py-4 pl-5 pr-4 text-xl leading-8 text-gray-700 md:text-2xl"
				>
					{{ postData.blog_intro }}
				</p>

				<hr v-if="postData.blog_intro" class="my-10 border-gray-200" />

				<div class="article-content" v-html="safeContent"></div>

				<div
					v-if="postData.custom_backlinks && postData.custom_backlinks.length"
					class="mt-12 rounded-xl bg-gray-50 p-8 border border-gray-100 shadow-sm"
				>
					<h3
						class="text-xs font-black uppercase tracking-[0.2em] text-gray-900 mb-6 flex items-center gap-2"
					>
						Sources & Resources
					</h3>
					<ul class="space-y-4">
						<li
							v-for="(link, index) in safeBacklinks"
							:key="index"
							class="flex items-start gap-3 group"
						>
							<svg
								class="h-5 w-5 text-[#b42318] mt-0.5 flex-shrink-0 opacity-70 group-hover:opacity-100 transition-opacity"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
								/>
							</svg>
							<a
								:href="link.href"
								target="_blank"
								rel="noopener noreferrer"
								class="text-[15px] font-medium text-gray-600 hover:text-[#b42318] transition-colors break-all leading-snug border-b border-transparent hover:border-[#b42318]"
							>
								Reference Link
							</a>
						</li>
					</ul>
				</div>

				<div class="mt-14 border-t border-gray-200 pt-8">
					<button
						@click="$router.back()"
						class="text-xs font-black uppercase tracking-[0.16em] text-gray-400 transition-colors hover:text-[#b42318]"
					>
						← Back to Stories
					</button>
				</div>
			</article>

			<div
				v-else
				class="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 py-24 text-center"
			>
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
import { computed, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { blogApi } from "../api/blogServices";
import { formatDate, getImageUrl, getSafeUrl, sanitizeHtml } from "../utils/post";

const route = useRoute();
const postData = ref(null);
const loading = ref(true);
const error = ref("");

const safeContent = computed(() => sanitizeHtml(postData.value?.content));
const safeBacklinks = computed(() =>
	(postData.value?.custom_backlinks || [])
		.map((link) => ({ href: getSafeUrl(link.link_of_original_source) }))
		.filter((link) => link.href !== "#"),
);

const fetchFullPost = async () => {
	loading.value = true;
	error.value = "";

	try {
		postData.value = await blogApi.getPost(route.params.name);
	} catch (error) {
		postData.value = null;
		error.value = error.message;
	} finally {
		loading.value = false;
	}
};

watch(() => route.params.name, fetchFullPost, { immediate: true });
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

.article-content h1 {
	font-size: 2rem;
}

.article-content h2 {
	font-size: 1.625rem;
}

.article-content h3 {
	font-size: 1.375rem;
}

.article-content h4 {
	font-size: 1.125rem;
}

.article-content p {
	margin: 1.25rem 0;
}

.article-content a {
	color: #b42318;
	text-decoration: underline;
	text-underline-offset: 3px;
}

.article-content a:hover {
	color: #971b12;
}

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

.article-content ul {
	list-style-type: disc;
}

.article-content ol {
	list-style-type: decimal;
}

.article-content li {
	margin: 0.4rem 0;
}

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
