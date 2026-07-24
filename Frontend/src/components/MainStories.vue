<template>
	<section id="latest" class="bg-[#f6f3ee] px-4 py-10 font-sans">
		<div class="mx-auto max-w-7xl">
			<div
				class="mb-6 flex flex-col justify-between gap-3 border-b border-gray-200 pb-5 md:flex-row md:items-end"
			>
				<div>
					<p class="kicker">Featured</p>
					<h2 class="section-heading mt-2">Latest Blogs</h2>
				</div>
				<p class="max-w-lg text-sm leading-6 text-gray-500">
					No sales pitch. Just the info you actually need.
				</p>
			</div>
<!--  -->
			<div
				class="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-4 lg:grid-cols-[2fr_1fr_1fr]"
			>
				<div class="space-y-4 md:col-span-2 lg:col-span-1">
					<div
						class="group relative h-[300px] w-full overflow-hidden rounded-lg bg-gray-900 shadow-[0_22px_60px_rgba(15,23,42,0.22)] md:h-[400px] lg:h-[352px]"
					>
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
								<div
									class="absolute inset-x-0 bottom-0 w-full bg-gradient-to-t from-black/90 via-black/40 to-transparent p-5 md:p-8"
								>
									<router-link
										v-if="post.blog_category"
										:to="{
											name: 'Category',
											params: { slug: post.blog_category },
										}"
										class="story-chip mb-2 transition-opacity hover:opacity-90"
									>
										{{ post.blog_category }}
									</router-link>
									<span v-else class="story-chip mb-2"> General </span>

									<router-link
										:to="{ name: 'PostDetail', params: { name: post.name } }"
									>
										<h3
											class="mb-2 cursor-pointer text-xl font-extrabold leading-tight text-white transition-colors hover:text-gray-200 md:text-2xl"
										>
											{{ post.title }}
										</h3>
									</router-link>

									<p
										class="text-[11px] font-medium uppercase tracking-wider text-gray-300 opacity-80"
									>
										{{ formatDate(post.published_on) }} /
										{{ post.blogger || "Admin" }}
									</p>
								</div>
							</div>
						</transition-group>

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

				<div class="space-y-4">
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
							<div
								class="absolute inset-x-0 bottom-0 w-full bg-gradient-to-t from-black/90 to-transparent p-4"
							>
								<router-link
									v-if="post.blog_category"
									:to="{
										name: 'Category',
										params: { slug: post.blog_category },
									}"
									class="story-chip mb-1 scale-90 origin-left transition-opacity hover:opacity-90"
								>
									{{ post.blog_category }}
								</router-link>
								<span v-else class="story-chip mb-1 scale-90 origin-left">
									General
								</span>

								<router-link
									:to="{ name: 'PostDetail', params: { name: post.name } }"
								>
									<h4
										class="mb-1 line-clamp-2 cursor-pointer text-sm font-extrabold leading-tight text-white hover:underline"
									>
										{{ post.title }}
									</h4>
								</router-link>

								<p class="text-[10px] font-bold uppercase text-gray-400">
									{{ formatDate(post.published_on) }}
								</p>
							</div>
						</div>
					</div>
				</div>

				<div class="space-y-4">
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
							<div
								class="absolute inset-x-0 bottom-0 w-full bg-gradient-to-t from-black/90 to-transparent p-4"
							>
								<router-link
									v-if="post.blog_category"
									:to="{
										name: 'Category',
										params: { slug: post.blog_category },
									}"
									class="story-chip mb-1 scale-90 origin-left transition-opacity hover:opacity-90"
								>
									{{ post.blog_category }}
								</router-link>
								<span v-else class="story-chip mb-1 scale-90 origin-left">
									General
								</span>

								<router-link
									:to="{ name: 'PostDetail', params: { name: post.name } }"
								>
									<h4
										class="mb-1 line-clamp-2 cursor-pointer text-sm font-extrabold leading-tight text-white hover:underline"
									>
										{{ post.title }}
									</h4>
								</router-link>

								<p class="text-[10px] font-bold uppercase text-gray-400">
									{{ formatDate(post.published_on) }}
								</p>
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

watch(
	() => props.posts,
	(newPosts) => {
		shuffledPosts.value = shuffle(newPosts || []);
		currentIndex.value = 0;
	},
	{ immediate: true },
);

const mainStories = computed(() => shuffledPosts.value.slice(0, 5));
const editorsPick = computed(() => shuffledPosts.value.slice(5, 7));
const trendingStories = computed(() => shuffledPosts.value.slice(7, 9));

const nextSlide = () => {
	if (mainStories.value.length)
		currentIndex.value = (currentIndex.value + 1) % mainStories.value.length;
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
