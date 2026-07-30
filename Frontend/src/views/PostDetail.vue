	<template>
		<main class="min-h-screen bg-white">
			<div class="border-b border-gray-200 bg-[#f6f3ee] px-4 py-3">
				<div class="mx-auto max-w-4xl">
					<nav class="flex items-center gap-2 text-sm font-bold" aria-label="Breadcrumb">
						<router-link to="/" class="text-[#b42318] transition-colors hover:underline">Home</router-link>
						<span class="text-gray-500" aria-hidden="true"> > </span>
						<span v-if="postData" class="truncate text-[#b42318]">{{
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
					<router-link v-if="postData.blog_category"
						:to="{ name: 'Category', params: { slug: postData.blog_category } }"
						class="kicker transition-colors hover:underline">
						{{ postData.blog_category }}
					</router-link>
					<span v-else class="kicker">Uncategorized</span>

					<h1
						class="mt-4 text-3xl font-black leading-tight tracking-tight text-gray-900 sm:text-[34px] md:text-[38px]">
						{{ postData.title }}
					</h1>

					<div
						class="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-bold uppercase tracking-[0.14em] text-gray-400">
						<span>{{
							formatDate(postData.published_on, {
								month: "long",
								day: "numeric",
								year: "numeric",
							})
						}}</span>
						<span aria-hidden="true" class="text-gray-300">|</span>
						<span>{{ postData.blogger || "Theme Admin" }}</span>
						<span aria-hidden="true" class="text-gray-300">|</span>
						<span>{{ formatClickCount(postData.custom_click_count) }}</span>
					</div>

					<div class="my-10 overflow-hidden rounded-lg bg-gray-100 shadow-[0_22px_60px_rgba(15,23,42,0.14)]">
						<img :src="getImageUrl(postData.meta_image)" :alt="postData.title"
							class="max-h-[520px] w-full object-cover" />
					</div>

					<p v-if="postData.blog_intro"
						class="bg-black/85 rounded-2xl px-4 pl-5 py-4 text-justify text-lg leading-normal text-white shadow-xl md:text-lg md:leading-normal">
						{{ postData.blog_intro }}
					</p>

					<hr v-if="postData.blog_intro" class="my-10 border-gray-200" />

					<div class="article-content" v-html="safeContent"></div>

					<div v-if="hasSourcesSection"
						class="mt-12 rounded-xl border border-gray-100 bg-gray-50 p-8 shadow-sm">
						<div class="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
							<div class="min-w-0 flex-1">
								<h3
									class="text-xs font-black uppercase tracking-[0.2em] text-gray-900 mb-6 flex items-center gap-2">
									Sources & Resources
								</h3>
								<ul v-if="safeBacklinks.length" class="space-y-4">
									<li v-for="(link, index) in safeBacklinks" :key="index"
										class="flex items-start gap-3 group">
										<svg class="h-5 w-5 text-[#b42318] mt-0.5 flex-shrink-0 opacity-70 group-hover:opacity-100 transition-opacity"
											fill="none" viewBox="0 0 24 24" stroke="currentColor">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
												d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
										</svg>
										<a :href="link.href" target="_blank" rel="noopener noreferrer"
											class="text-[15px] font-medium text-gray-600 hover:text-[#b42318] transition-colors break-all leading-snug border-b border-transparent hover:border-[#b42318]">
											{{ link.label }}
										</a>
									</li>
								</ul>
							</div>
						</div>
					</div>

					<div class="mt-14 border-t border-gray-200 pt-8">
						<button @click="$router.back()"
							class="px-4 py-4 text-xs font-black uppercase tracking-[0.16em] text-white transition-colors border border-white/20 rounded-[10px] bg-red-600">
							Back to Blogs
						</button>
					</div>
				</article>

				<div v-else
					class="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50 py-24 text-center">
					<p class="text-xl font-bold text-gray-500">Post not found.</p>
					<button @click="$router.push('/')"
						class="mt-4 text-sm font-bold uppercase tracking-[0.16em] text-[#b42318] hover:underline">
						Go Home
					</button>
				</div>
			</div>
			<div class="border-t border-gray-200 bg-[#f8f6f2] px-4 py-10 md:px-6">
				<div class="mx-auto max-w-4xl">
					<div class="rounded-2xl border border-[#eadfd3] bg-white p-6 shadow-sm md:p-8">
						<div class="flex items-start gap-4">
							<!-- <div
								class="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#b42318] text-white shadow-sm">
								<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
									<path stroke-linecap="round" stroke-linejoin="round"
										d="M13 16h-1v-4h-1m1-4h.01M12 21a9 9 0 100-18 9 9 0 000 18z" />
								</svg>
							</div> -->

							<div>
								<!-- <p class="kicker">Disclosure Policy</p> -->
								<h2 class="mt-2 text-xl font-black tracking-tight text-gray-900">
									Disclosure Policy
								</h2>
								<p class="mt-3 text-sm leading-7 text-gray-600 md:text-[15px]">
									Some links in this article may point to partner products or services. If you choose
									to
									use them, we may earn a commission at no extra cost to you. Our editorial content is
									written to be useful, clear, and independent regardless of any partner relationship.
								</p>
							</div>
						</div>
					</div>
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
		.map((link) => ({
			href: getSafeUrl(link.link_of_original_source),
			label: String(link.link_label || link.label || "Reference Link").trim() || "Reference Link",
		}))
		.filter((link) => link.href !== "#"),
);
const hasSourcesSection = computed(() => safeBacklinks.value.length > 0);

const fetchFullPost = async () => {
	loading.value = true;
	error.value = "";

	try {
		const post = await blogApi.getPost(route.params.name);
		postData.value = post;

		try {
			const clickData = await blogApi.recordPostClick(route.params.name);
			if (postData.value) {
				postData.value.custom_click_count = clickData?.click_count || 0;
			}
		} catch (trackingError) {
			console.warn("Unable to record post click.", trackingError);
		}
	} catch (error) {
		postData.value = null;
		error.value = error.message;
	} finally {
		loading.value = false;
	}
};

const formatClickCount = (count) => `${Number(count || 0)} Views`;

watch(() => route.params.name, fetchFullPost, { immediate: true });
</script>

<style>
.article-content {
	font-size: 1.0625rem;
	line-height: 1.85;
	color: #334155;
	min-width: 0;
	max-width: 100%;
	overflow-wrap: anywhere;
	word-break: break-word;
	white-space: normal;
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

.article-content h1,
.article-content h2,
.article-content h3,
.article-content h4,
.article-content p,
.article-content li,
.article-content blockquote,
.article-content details[data-type="faq-accordion"] summary,
.article-content details.faq-accordion summary,
.article-content th,
.article-content td {
	max-width: 100%;
	overflow-wrap: anywhere;
	word-break: break-word;
	white-space: normal;
}

.article-content p {
	margin: 1.25rem 0;
}

.article-content .article-feature {
	margin: 2.5rem 0;
	display: grid;
	gap: 1.5rem;
	align-items: start;
}

.article-content .article-feature--no-media {
	grid-template-columns: minmax(0, 1fr);
}

.article-content .article-feature__media {
	margin: 0;
}

.article-content .article-feature__image {
	margin: 0;
	width: 100%;
	aspect-ratio: 5 / 4;
	object-fit: cover;
	border-radius: 1.5rem;
	box-shadow: 0 18px 45px rgba(15, 23, 42, 0.12);
}

.article-content .article-feature__caption {
	margin-top: 0.85rem;
	text-align: center;
	font-size: 0.95rem;
	font-weight: 900;
	line-height: 1.4;
	color: #46362a;
}

.article-content .article-feature__content {
	min-width: 0;
	align-self: center;
}

.article-content .article-feature__headline {
	margin-top: 0;
	margin-bottom: 1rem;
	font-size: clamp(1.85rem, 1.2rem + 1.8vw, 2.7rem);
	line-height: 1.12;
	letter-spacing: -0.03em;
}

.article-content .article-feature__body {
	color: #334155;
}

.article-content .article-feature__body p {
	margin: 0 0 1rem;
}

.article-content .article-feature__body p:last-child {
	margin-bottom: 0;
}

.article-content a {
	color: #b42318;
	text-decoration: underline;
	text-underline-offset: 3px;
	overflow-wrap: anywhere;
	word-break: break-word;
}

.article-content a:hover {
	color: #971b12;
}

.article-content .article-cta {
	margin: 2rem 0;
	display: flex;
	justify-content: center;
}

.article-content .article-cta[data-align="left"] {
	justify-content: flex-start;
}

.article-content .article-cta[data-align="right"] {
	justify-content: flex-end;
}

.article-content .article-cta__button {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	border-radius: 9999px;
	text-align: center;
	font-weight: 900;
	letter-spacing: 0.16em;
	text-transform: uppercase;
	color: #fff;
	text-decoration: none;
	transition: background-color 0.2s ease;
}

.article-content .article-cta[data-size="small"] .article-cta__button {
	padding: 0.6rem 1rem;
	font-size: 0.625rem;
}

.article-content .article-cta[data-size="medium"] .article-cta__button {
	padding: 0.9rem 1.4rem;
	font-size: 0.75rem;
}

.article-content .article-cta[data-size="large"] .article-cta__button {
	padding: 1.15rem 2rem;
	font-size: 0.875rem;
}

.article-content .article-cta__button:hover {
	color: #fff;
	filter: brightness(0.9);
}

.article-content img {
	display: block;
	margin: 2rem 0;
	max-width: 100%;
	border-radius: 0.5rem;
}

.article-content img[data-align="left"] {
	margin-left: 0;
	margin-right: auto;
}

.article-content img[data-align="center"] {
	margin-left: auto;
	margin-right: auto;
}

.article-content img[data-align="right"] {
	margin-left: auto;
	margin-right: 0;
}

.article-content img[data-float="left"] {
	float: left;
	margin-right: 1.25rem;
	margin-left: 0;
}

.article-content img[data-float="right"] {
	float: right;
	margin-left: 1.25rem;
	margin-right: 0;
}

.article-content blockquote {
	margin: 1.5rem 0;
	padding-left: 1.25rem;
	border-left: 4px solid #b42318;
	color: #475569;
	font-style: italic;
}

.article-content details[data-type="faq-accordion"],
.article-content details.faq-accordion {
	margin: 1.5rem 0;
	overflow: hidden;
	border: 1px solid #e2e8f0;
	border-radius: 1rem;
	background: #f8fafc;
}

.article-content details[data-type="faq-accordion"] summary,
.article-content details.faq-accordion summary {
	cursor: pointer;
	list-style: none;
	padding: 1rem 1.25rem;
	font-weight: 800;
	color: #0f172a;
}

.article-content details[data-type="faq-accordion"] summary::-webkit-details-marker,
.article-content details.faq-accordion summary::-webkit-details-marker {
	display: none;
}

.article-content .faq-accordion__answer {
	white-space: pre-line;
	border-top: 1px solid #e2e8f0;
	padding: 0 1.25rem 1rem;
	color: #475569;
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

.article-content * {
	max-width: 100%;
}

.article-content code {
	background: #f1f5f9;
	padding: 0.15em 0.4em;
	border-radius: 3px;
	font-size: 0.9em;
	font-family: ui-monospace, monospace;
	overflow-wrap: normal;
	word-break: normal;
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

@media (min-width: 768px) {
	.article-content .article-feature {
		grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
	}

	.article-content .article-feature--reverse .article-feature__media {
		order: 2;
	}

	.article-content .article-feature--reverse .article-feature__content {
		order: 1;
	}
}
</style>
