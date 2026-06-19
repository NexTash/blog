<template>
	<section class="bg-[#f6f3ee] px-4 pb-16">
		<div class="mx-auto max-w-7xl">
			<!-- Section heading -->
			<div class="section-accent mb-6">
				<h2 class="text-xl font-black uppercase tracking-tight text-gray-900">You May Have Missed</h2>
			</div>

			<div v-if="missedPosts.length" class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
				<article
					v-for="post in missedPosts"
					:key="post.name"
					class="surface group p-6 transition-all hover:-trangray-y-1 hover:shadow-[0_18px_50px_rgba(15,23,42,0.12)]"
				>
					<span class="block text-[11px] font-black uppercase tracking-[0.14em] text-[#b42318]">
						{{ post.blog_category || "Uncategorized" }}
					</span>

					<router-link :to="{ name: 'PostDetail', params: { name: post.name } }">
						<h3 class="mt-3 line-clamp-2 text-lg font-black leading-snug text-gray-900 transition-colors group-hover:text-[#b42318]">
							{{ post.title }}
						</h3>
					</router-link>

					<div class="mt-4 text-[11px] font-bold uppercase tracking-[0.14em] text-gray-400">
						{{ formatDate(post.published_on, { year: "numeric", month: "long", day: "numeric" }) }}
						<span class="mx-1">/</span>
						{{ post.blogger || "Admin" }}
					</div>
				</article>
			</div>

			<div v-else class="rounded-lg border border-dashed border-gray-300 bg-white py-10 text-center text-sm font-medium text-gray-400">
				Loading...
			</div>
		</div>
	</section>
</template>

<script setup>
import { computed } from "vue";
import { formatDate } from "../utils/post";

const props = defineProps({ posts: { type: Array, required: true, default: () => [] } });
const missedPosts = computed(() => (props.posts || []).slice(4, 8));
</script>
