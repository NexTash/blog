<template>
	<section id="latest" class="bg-[#f6f3ee] px-4 py-8 font-sans md:py-12">
		<div class="mx-auto max-w-7xl">

			<!-- Loading state -->
			<div v-if="shuffledPosts.length === 0" class="flex h-64 flex-col items-center justify-center">
				<div class="mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-[#b42318]"></div>
				<p class="animate-pulse font-medium text-gray-500">Fetching latest stories...</p>
			</div>

			<!-- 3-column grid -->
			<div v-else class="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-4 lg:grid-cols-[2fr_1fr_1fr]">

				<!-- ── COLUMN 1: Main Carousel ────────────────────────────── -->
				<div class="space-y-4 md:col-span-2 lg:col-span-1">
					<!-- Header row -->
					<div class="flex h-12 items-center justify-between border-b border-gray-200 pb-2">
						<!-- <h2 class="section-accent text-lg font-extrabold uppercase tracking-tight text-gray-900 md:text-xl">
							Main Stories
						</h2>
						<div class="flex space-x-1">
							<button
								@click="prevSlide"
								class="rounded-full border border-gray-300 bg-white p-1.5 shadow-sm transition-colors hover:bg-gray-100 active:scale-95"
								aria-label="Previous slide"
							>
								<svg class="h-4 w-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" />
								</svg>
							</button>
							<button
								@click="nextSlide"
								class="rounded-full border border-gray-300 bg-white p-1.5 shadow-sm transition-colors hover:bg-gray-100 active:scale-95"
								aria-label="Next slide"
							>
								<svg class="h-4 w-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
								</svg>
							</button>
						</div> -->
					</div>

					<!-- Carousel -->
					<div class="group relative h-[300px] w-full overflow-hidden rounded-lg bg-gray-900 shadow-[0_22px_60px_rgba(15,23,42,0.22)] md:h-[400px] lg:h-[352px]">
						<transition-group name="fade">
							<div
								v-for="(post, index) in mainStories"
								:key="post.name"
								v-show="currentIndex === index"
								class="absolute inset-0 h-full w-full"
							>
								<img
									:src="getImageUrl(post.meta_image)"
									:alt="post.title"
									class="h-full w-full object-cover opacity-60 transition-transform duration-1000 group-hover:scale-110"
								/>
								<div class="absolute inset-x-0 bottom-0 w-full bg-gradient-to-t from-black/90 via-black/40 to-transparent p-5 md:p-8">
									<router-link
										v-if="post.blog_category"
										:to="{ name: 'Category', params: { slug: post.blog_category } }"
										class="story-chip mb-2 transition-opacity hover:opacity-90"
									>
										{{ post.blog_category }}
									</router-link>
									<span v-else class="story-chip mb-2">
										General
									</span>

									<router-link :to="{ name: 'PostDetail', params: { name: post.name } }">
										<h3 class="mb-2 cursor-pointer text-xl font-extrabold leading-tight text-white transition-colors hover:text-gray-200 md:text-2xl">
											{{ post.title }}
										</h3>
									</router-link>

									<p class="text-[11px] font-medium uppercase tracking-wider text-gray-300 opacity-80">
										{{ formatDate(post.published_on) }} / {{ post.blogger || 'Admin' }}
									</p>
								</div>
							</div>
						</transition-group>

						<!-- Slide indicators -->
						<div class="absolute bottom-4 right-4 flex gap-1.5">
							<button
								v-for="(_, i) in mainStories"
								:key="i"
								@click="currentIndex = i"
								:class="currentIndex === i ? 'w-5 bg-white' : 'w-2 bg-white/40'"
								class="h-2 rounded-full transition-all duration-300"
								:aria-label="`Go to slide ${i + 1}`"
							></button>
						</div>
					</div>
				</div>

				<!-- ── COLUMN 2: Editor's Pick ────────────────────────────── -->
				<div class="space-y-4">
					<div class="flex h-12 items-center border-b border-gray-200 pb-2">
						<!-- <h2 class="section-accent text-lg font-extrabold uppercase text-gray-900">
							Editor's Pick
						</h2> -->
					</div>

					<div class="grid grid-cols-1 gap-2">
						<div
							v-for="post in editorsPick"
							:key="post.name"
							class="group relative h-[180px] w-full overflow-hidden rounded-lg bg-gray-800 shadow-md lg:h-[171px]"
						>
							<img
								:src="getImageUrl(post.meta_image)"
								:alt="post.title"
								class="h-full w-full object-cover opacity-70 transition-transform duration-500 group-hover:scale-110"
							/>
							<div class="absolute inset-x-0 bottom-0 w-full bg-gradient-to-t from-black/90 to-transparent p-4">
								<router-link
									v-if="post.blog_category"
									:to="{ name: 'Category', params: { slug: post.blog_category } }"
									class="story-chip mb-1 scale-90 origin-left transition-opacity hover:opacity-90"
								>
									{{ post.blog_category }}
								</router-link>
								<span v-else class="story-chip mb-1 scale-90 origin-left">
									General
								</span>

								<router-link :to="{ name: 'PostDetail', params: { name: post.name } }">
									<h4 class="mb-1 line-clamp-2 cursor-pointer text-sm font-extrabold leading-tight text-white hover:underline">
										{{ post.title }}
									</h4>
								</router-link>

								<p class="text-[10px] font-bold uppercase text-gray-400">{{ formatDate(post.published_on) }}</p>
							</div>
						</div>
					</div>
				</div>

				<!-- ── COLUMN 3: Trending ─────────────────────────────────── -->
				<div class="space-y-4">
					<div class="flex h-12 items-center border-b border-gray-200 pb-2">
						<!-- <h2 class="section-accent text-lg font-extrabold uppercase text-gray-900">
							Trending
						</h2> -->
					</div>

					<div class="grid grid-cols-1 gap-2">
						<div
							v-for="post in trendingStories"
							:key="post.name"
							class="group relative h-[180px] w-full overflow-hidden rounded-lg bg-gray-800 shadow-md lg:h-[171px]"
						>
							<img
								:src="getImageUrl(post.meta_image)"
								:alt="post.title"
								class="h-full w-full object-cover opacity-70 transition-transform duration-500 group-hover:scale-110"
							/>
							<div class="absolute inset-x-0 bottom-0 w-full bg-gradient-to-t from-black/90 to-transparent p-4">
								<router-link
									v-if="post.blog_category"
									:to="{ name: 'Category', params: { slug: post.blog_category } }"
									class="story-chip mb-1 scale-90 origin-left transition-opacity hover:opacity-90"
								>
									{{ post.blog_category }}
								</router-link>
								<span v-else class="story-chip mb-1 scale-90 origin-left">
									General
								</span>

								<router-link :to="{ name: 'PostDetail', params: { name: post.name } }">
									<h4 class="mb-1 line-clamp-2 cursor-pointer text-sm font-extrabold leading-tight text-white hover:underline">
										{{ post.title }}
									</h4>
								</router-link>

								<p class="text-[10px] font-bold uppercase text-gray-400">{{ formatDate(post.published_on) }}</p>
							</div>
						</div>
					</div>
				</div>

			</div>
		</div>
	</section>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, computed } from "vue";
import { getImageUrl, formatDate } from "../utils/post";

const props = defineProps({
	posts: { type: Array, required: true, default: () => [] },
});

const currentIndex = ref(0);
const shuffledPosts = ref([]);
let timer = null;

// Fisher-Yates shuffle — returns a new array
const shuffle = (arr) => {
	const a = [...arr];
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}
	return a;
};

// Re-shuffle only when posts actually change (e.g. after fetch resolves)
watch(
	() => props.posts,
	(newPosts) => {
		shuffledPosts.value = shuffle(newPosts || []);
		currentIndex.value = 0;
	},
	{ immediate: true }
);

const mainStories    = computed(() => shuffledPosts.value.slice(0, 5));
const editorsPick    = computed(() => shuffledPosts.value.slice(5, 7));
const trendingStories = computed(() => shuffledPosts.value.slice(7, 9));

const nextSlide = () => {
	if (mainStories.value.length)
		currentIndex.value = (currentIndex.value + 1) % mainStories.value.length;
};

const prevSlide = () => {
	if (mainStories.value.length)
		currentIndex.value =
			currentIndex.value === 0 ? mainStories.value.length - 1 : currentIndex.value - 1;
};

onMounted(() => {
	timer = setInterval(nextSlide, 5000);
});

onUnmounted(() => clearInterval(timer));
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.8s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>
