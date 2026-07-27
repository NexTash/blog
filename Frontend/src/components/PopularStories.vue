<template>
	<section id="popular" class="bg-[#f6f3ee] px-4 pb-10 pt-16 sm:px-6 sm:pt-20">
		<div class="mx-auto max-w-7xl">
			<!-- Section Header -->
			<div class="mb-10 flex flex-col gap-4 border-b border-gray-200 pb-6 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
				<div>
					<span class="text-[12px] font-bold uppercase tracking-[0.3em] text-[#b42318]">Trending Now</span>
					<h2 class="mt-2 text-3xl font-black uppercase tracking-tighter text-gray-900 sm:text-4xl">
						Popular Blogs
					</h2>
				</div>
				<div class="hidden text-sm font-medium text-gray-400 lg:block">
					Based on weekly readers
				</div>
			</div>

			<div v-if="popularPosts.length" class="grid grid-cols-1 gap-y-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-y-0">
				<article v-for="(post, i) in popularPosts" :key="post.name"
					class="group relative px-0 sm:px-6 lg:border-r lg:border-gray-200 last:border-r-0">
					<!-- Rank Number (Graphic Element) -->
					<div class="absolute -top-6 left-0 z-0 select-none overflow-hidden sm:-top-8 sm:left-4">
						<span
							class="text-7xl font-black leading-none text-gray-200/60 transition-colors duration-500 group-hover:text-[#b42318]/10 sm:text-8xl">
							{{ String(i + 1).padStart(2, "0") }}
						</span>
					</div>

					<!-- Content Wrapper -->
					<div class="relative z-10 pt-4">
						<!-- Category with dot accent -->
						<div class="flex items-center gap-2 mb-4">
							<span class="h-1.5 w-1.5 rounded-full bg-[#b42318]"></span>
							<span class="text-[11px] font-black uppercase tracking-[0.2em] text-gray-500">
								{{ post.blog_category || "Uncategorized" }}
							</span>
						</div>

						<router-link :to="{ name: 'PostDetail', params: { name: post.name } }">
							<h3
								class="mb-4 line-clamp-3 text-xl font-extrabold leading-[1.3] text-gray-900 transition-colors group-hover:text-[#b42318]">
								{{ post.title }}
							</h3>
						</router-link>

						<!-- Metadata -->
						<div class="mt-6 flex flex-col gap-1">
							<span class="text-[11px] font-bold uppercase tracking-widest text-gray-400">
								By {{ post.blogger || "Admin" }}
							</span>
							<span class="text-[11px] font-medium text-gray-400">
								{{ formatDate(post.published_on, { month: "long", day: "numeric", year: "numeric" }) }}
							</span>
							<span class="text-[11px] font-bold uppercase tracking-widest text-[#b42318]">
								{{ formatClickCount(post.custom_click_count) }}
							</span>
						</div>

						<!-- Hover Decorative Line -->
						<div class="mt-6 h-0.5 w-0 bg-[#b42318] transition-all duration-500 group-hover:w-full"></div>
					</div>
				</article>
			</div>

			<!-- Empty State -->
			<div v-else class="rounded-xl border-2 border-dashed border-gray-200 bg-white/30 py-20 text-center">
				<p class="text-sm font-bold uppercase tracking-widest text-gray-400">
					The rankings are being updated...
				</p>
			</div>
		</div>
	</section>
</template>

<script setup>
import { computed } from "vue";
import { formatDate } from "../utils/post";

const props = defineProps({
	posts: {
		type: Array,
		default: () => []
	}
});

const popularPosts = computed(() =>
	[...(props.posts || [])]
		.sort((left, right) => {
			const leftClicks = Number(left?.custom_click_count || 0);
			const rightClicks = Number(right?.custom_click_count || 0);

			if (rightClicks !== leftClicks) {
				return rightClicks - leftClicks;
			}

			return new Date(right?.published_on || 0) - new Date(left?.published_on || 0);
		})
		.slice(0, 4),
);

const formatClickCount = (count) => `${Number(count || 0)} Views`;
</script>

<style scoped>
/* Smooth transition for the rank numbers */
.text-8xl {
	font-family: 'Inter', sans-serif;
	/* Ensure a clean, heavy font is used */
	-webkit-text-stroke: 1px transparent;
}

article:hover .text-8xl {
	-webkit-text-stroke: 1px rgba(180, 35, 24, 0.1);
}

/* Staggered entrance animation for items */
article {
	animation: slideUp 0.6s ease-out forwards;
	opacity: 0;
}

article:nth-child(1) {
	animation-delay: 0.1s;
}

article:nth-child(2) {
	animation-delay: 0.2s;
}

article:nth-child(3) {
	animation-delay: 0.3s;
}

article:nth-child(4) {
	animation-delay: 0.4s;
}

@keyframes slideUp {
	from {
		opacity: 0;
		transform: translateY(20px);
	}

	to {
		opacity: 1;
		transform: translateY(0);
	}
}
</style>
