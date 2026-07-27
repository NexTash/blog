<template>
	<section class="bg-[#f8f6f2] px-4 py-16 sm:px-6 sm:py-20">
		<div class="mx-auto max-w-7xl">
			<!-- Section Header with Editorial Line -->
			<div class="mb-8 flex flex-col gap-3 sm:mb-10 sm:flex-row sm:items-center sm:justify-between">
				<div class="flex items-center gap-4">
					<!-- <span class="h-px w-12 bg-[#b42318]"></span> -->
					<h2 class="text-xl font-black uppercase tracking-widest text-gray-900 sm:text-2xl">
						You May Have Missed
					</h2>
				</div>
				<!-- <router-link to="/blog"
					class="text-sm font-bold uppercase tracking-widest text-gray-500 hover:text-[#b42318] transition-colors">
					View All →
				</router-link> -->
			</div>

			<!-- Posts Grid -->
			<div v-if="missedPosts.length" class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
				<article v-for="post in missedPosts" :key="post.name" class="group flex flex-col">
					<!-- Image Container -->
					<router-link :to="{ name: 'PostDetail', params: { name: post.name } }"
						class="relative mb-5 block aspect-[16/10] overflow-hidden rounded-sm bg-gray-200">
						<img v-if="post.meta_image" :src="post.meta_image" :alt="post.title"
							class="h-full w-full object-cover transition-transform duration-700 ease-out" />
						<!-- Fallback for no image -->
						<div v-else class="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">
							<svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 opacity-20" fill="none"
								viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
									d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
							</svg>
						</div>
						<!-- Overlay Category Badge -->
						<div class="absolute bottom-3 left-3">
							<span
								class="bg-white px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-900 shadow-sm">
								{{ post.blog_category || "General" }}
							</span>
						</div>
					</router-link>

					<!-- Content -->
					<div class="flex flex-1 flex-col">
						<div
							class="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.15em] text-[#b42318]">
							<span>{{ post.blogger || "Staff" }}</span>
							<span class="h-1 w-1 rounded-full bg-gray-300"></span>
							<span class="text-gray-500">
								{{ formatDate(post.published_on, { month: "short", day: "numeric" }) }}
							</span>
						</div>

						<router-link :to="{ name: 'PostDetail', params: { name: post.name } }">
							<h3 class="mb-3 line-clamp-2 text-xl font-black leading-[1.2] text-gray-900">
								{{ post.title }}
							</h3>
						</router-link>
					</div>
				</article>
			</div>

			<!-- Empty State -->
			<div v-else
				class="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-white/50 py-20 text-center">
				<div class="mb-4 rounded-full bg-gray-100 p-4 text-gray-400">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24"
						stroke="currentColor">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
							d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2z" />
					</svg>
				</div>
				<p class="text-sm font-semibold text-gray-500">More stories are on their way.</p>
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
		required: true,
		default: () => [],
	},
});

// Taking items 4 through 8 as "missed" content
const missedPosts = computed(() => (props.posts || []).slice(4, 8));
</script>

<style scoped>
/* Optional: Custom Bezier Curve for smoother image scaling */


.group:hover img {
	transform: scale(1.08);
}

/* Subtle fade in for the grid */
.grid {
	animation: fadeIn 0.8s ease-out;
}

@keyframes fadeIn {
	from {
		opacity: 0;
		transform: translateY(10px);
	}

	to {
		opacity: 1;
		transform: translateY(0);
	}
}
</style>
