<template>
	<div
		class="ad-board-container my-6 p-1 bg-gradient-to-br from-gray-50 to-white rounded-3xl border border-gray-100 shadow-sm">
		<div class="p-6 md:p-8">
			<!-- Header Section -->
			<div class="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
				<div>
					<span
						class="text-blue-600 font-bold text-xs uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">Partners</span>
					<h2 class="text-3xl font-extrabold mt-2 text-gray-900 tracking-tight flex items-center gap-3">
						Sponsored Links
						<span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
					</h2>
				</div>
				<!-- <p class="text-gray-500 text-sm max-w-xs">
					Hand-picked resources and tools to help you build better projects.
				</p> -->
			</div>

			<!-- Skeleton Loading State -->
			<div v-if="adsResource.loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
				<div v-for="i in 3" :key="i" class="space-y-4">
					<div class="aspect-video bg-gray-200 rounded-2xl animate-pulse"></div>
					<div class="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
					<div class="h-3 bg-gray-100 rounded w-1/2 animate-pulse"></div>
				</div>
			</div>

			<!-- Error State -->
			<div v-else-if="adsResource.error"
				class="flex flex-col items-center justify-center py-12 px-4 rounded-2xl bg-red-50 border border-red-100">
				<div
					class="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4 text-xl">
					⚠️
				</div>
				<p class="text-red-800 font-semibold text-center">Failed to load advertisements</p>
				<p class="text-red-500 text-sm">{{ adsResource.error }}</p>
			</div>

			<!-- Ads Grid -->
			<div v-else-if="adsResource.data && adsResource.data.length > 0"
				class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
				<a v-for="ad in adsResource.data" :key="ad.name" v-outbound :href="getSafeUrl(ad.link)"
					rel="noopener noreferrer nofollow"
					class="group relative flex flex-col bg-white rounded-2xl transition-all duration-500 hover:-translate-y-2">
					<!-- Image Container with Overlay -->
					<div class="relative aspect-video overflow-hidden rounded-2xl z-0 shadow-sm border border-gray-100">
						<img v-if="ad.image" :src="getImageUrl(ad.image)" :alt="ad.title"
							class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
						<div v-else
							class="w-full h-full bg-gradient-to-tr from-gray-100 to-gray-50 flex items-center justify-center text-4xl">
							🎨
						</div>

						<!-- Sponsored Badge -->
						<div
							class="absolute top-3 left-3 px-2 py-1 bg-black/40 backdrop-blur-md rounded-md text-[10px] font-bold text-white uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300">
							Ad
						</div>
					</div>

					<div class="pt-5 pb-2">
						<h3
							class="text-lg font-bold text-gray-900 leading-snug group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
							{{ ad.title }}
						</h3>

						<div class="mt-4 flex items-center text-sm font-semibold text-blue-600">
							<span class="relative">
								Learn More
								<span
									class="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
							</span>
							<svg xmlns="http://www.w3.org/2000/svg"
								class="h-4 w-4 ml-1 transition-transform duration-300 group-hover:translate-x-1"
								fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
									d="M14 5l7 7m0 0l-7 7m7-7H3" />
							</svg>
						</div>
					</div>

					<div
						class="absolute inset-0 -z-10 bg-blue-600/5 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
					</div>
				</a>
			</div>

			<!-- Empty State -->
			<div v-else class="text-center py-16 border-2 border-dashed border-gray-200 rounded-3xl">
				<div class="text-4xl mb-4">✨</div>
				<p class="text-gray-500 font-medium italic">Opportunities pending...</p>
			</div>
		</div>
	</div>
</template>

<script setup>
import { defineProps } from "vue";
import { getImageUrl, getSafeUrl } from "../utils/post";

defineProps({
	adsResource: {
		type: Object,
		required: true,
		default: () => ({ data: [], loading: false, error: null, fetched: false }),
	},
});
</script>

<style scoped>
/* Optional: Smooth custom easing */
.group {
	transition-timing-function: cubic-bezier(0.23, 1, 0.32, 1);
}
</style>
