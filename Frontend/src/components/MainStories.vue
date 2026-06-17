<template>
    <div class="max-w-7xl mx-auto px-4 py-6 md:py-10 font-sans bg-[#f9f9f9]">

        <!-- 1. LOADING STATE (no posts yet) -->
        <div v-if="shuffledPosts.length === 0" class="flex flex-col justify-center items-center h-64">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#c80000] mb-4"></div>
            <p class="text-gray-500 animate-pulse font-medium">Fetching latest stories...</p>
        </div>

        <!-- 2. MAIN CONTENT -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr] lg:justify-center gap-6 md:gap-2">

            <!-- COLUMN 1: Carousel -->
            <div class="md:col-span-2 lg:col-span-1 space-y-4">
                <div class="flex justify-between items-center border-b border-gray-200 pb-2 h-12">
                    <h2
                        class="flex items-center text-lg md:text-xl font-extrabold text-black uppercase tracking-tight lg:font-extrabold ">
                        <span class="w-1 h-6 bg-[#c80000] mr-3"></span>
                        Main Stories
                    </h2>
                    <div class="flex space-x-1">
                        <button @click="prevSlide"
                            class="p-1.5 border border-gray-300 bg-white hover:bg-gray-100 shadow-sm active:scale-95">
                            <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                                    d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        <button @click="nextSlide"
                            class="p-1.5 border border-gray-300 bg-white hover:bg-gray-100 shadow-sm active:scale-95">
                            <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                                    d="M9 5l7 7-7 7" />
                            </svg>
                        </button>

                    </div>
                </div>

                <div
                    class="relative overflow-hidden group w-full h-[300px] md:h-[400px] lg:h-[351.449px] bg-gray-900 shadow-lg rounded-sm">
                    <transition-group name="fade">
                        <div v-for="(post, index) in mainStories" :key="post.name" v-show="currentIndex === index"
                            class="absolute inset-0 w-full h-full">
                            <img :src="getImageUrl(post.meta_image)"
                                class="w-full h-full object-cover opacity-60 transition-transform duration-1000 group-hover:scale-110" />
                            <div
                                class="absolute bottom-0 left-0 p-5 md:p-8 w-full bg-gradient-to-t from-black/100 via-black/40 to-transparent">
                                <span
                                    class="bg-[#c80000] text-white text-[10px] font-bold px-2 py-1 uppercase mb-2 inline-block">{{
                                        post.blog_category || 'General' }}</span>
                                <router-link :to="{ name: 'PostDetail', params: { name: post.name } }">
                                    <h3
                                        class="text-xl md:text-2xl font-extrabold text-white mb-2 leading-tight hover:text-gray-200 transition-colors cursor-pointer">
                                        {{ post.title }}
                                    </h3>
                                </router-link>
                                <p class="text-gray-300 text-[11px] font-medium uppercase tracking-wider opacity-80">
                                    {{ formatDate(post.published_on) }} / {{ post.blogger || 'Admin' }}
                                </p>
                            </div>
                        </div>
                    </transition-group>
                </div>
            </div>

            <!-- COLUMN 2: Editor's Pick -->
            <div class="space-y-4">
                <div class="flex items-center border-b border-gray-200 pb-2 h-12 uppercase">
                    <h2 class="flex items-center text-lg font-extrabold text-black uppercase">
                        <span class="w-1 h-6 bg-[#c80000] mr-3"></span> Editor's Pick
                    </h2>
                </div>
                <div class="grid grid-cols-1 gap-2">
                    <div v-for="post in editorsPick" :key="post.name"
                        class="relative w-full h-[180px] lg:h-[170.724px] bg-gray-800 overflow-hidden group shadow-md">
                        <img :src="getImageUrl(post.meta_image)"
                            class="w-full h-full object-cover opacity-70 group-hover:scale-110 transition-transform duration-500" />
                        <div class="absolute bottom-0 left-0 p-4 w-full bg-gradient-to-t from-black/90 to-transparent">
                            <span
                                class="bg-[#c80000] text-white text-[9px] font-bold px-2 py-0.5 uppercase mb-1 inline-block">{{
                                    post.blog_category || 'General' }}</span>
                            <router-link :to="{ name: 'PostDetail', params: { name: post.name } }">
                                <h4
                                    class="text-sm font-extrabold text-white leading-tight mb-1 hover:underline cursor-pointer line-clamp-2">
                                    {{ post.title }}</h4>
                            </router-link>
                            <p class="text-gray-400 text-[10px] font-bold uppercase">{{ formatDate(post.published_on) }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- COLUMN 3: Trending -->
            <div class="space-y-4">
                <div class="flex items-center border-b border-gray-200 pb-2 h-12 uppercase">
                    <h2 class="flex items-center text-lg font-extrabold text-black uppercase">
                        <span class="w-1 h-6 bg-[#c80000] mr-3"></span> Trending
                    </h2>
                </div>
                <div class="grid grid-cols-1 gap-2">
                    <div v-for="post in trendingStories" :key="post.name"
                        class="relative w-full h-[180px] lg:h-[170.724px] bg-gray-800 overflow-hidden group shadow-md">
                        <img :src="getImageUrl(post.meta_image)"
                            class="w-full h-full object-cover opacity-70 group-hover:scale-110 transition-transform duration-500" />
                        <div class="absolute bottom-0 left-0 p-4 w-full bg-gradient-to-t from-black/90 to-transparent">
                            <span
                                class="bg-[#c80000] text-white text-[9px] font-bold px-2 py-0.5 uppercase mb-1 inline-block">{{
                                    post.blog_category || 'General' }}</span>
                            <router-link :to="{ name: 'PostDetail', params: { name: post.name } }">
                                <h4
                                    class="text-sm font-extrabold text-white leading-tight mb-1 hover:underline cursor-pointer line-clamp-2">
                                    {{ post.title }}</h4>
                            </router-link>
                            <p class="text-gray-400 text-[10px] font-bold uppercase">{{ formatDate(post.published_on) }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, computed } from 'vue';

const props = defineProps({
    posts: {
        type: Array,
        required: true,
        default: () => []
    }
});

const currentIndex = ref(0);
let timer = null;

// Holds the shuffled copy — filled once when posts arrive
const shuffledPosts = ref([]);

// Fisher–Yates shuffle (returns a new array, doesn't mutate the original)
const shuffle = (arr) => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
};

// Re-shuffle only when the incoming posts actually change (e.g. fetch resolves)
watch(
    () => props.posts,
    (newPosts) => {
        shuffledPosts.value = shuffle(newPosts || []);
        currentIndex.value = 0; // reset carousel to first slide
    },
    { immediate: true }
);

const mainStories = computed(() => shuffledPosts.value.slice(0, 5));
const editorsPick = computed(() => shuffledPosts.value.slice(5, 7));
const trendingStories = computed(() => shuffledPosts.value.slice(7, 9));

const getImageUrl = (url) => {
    if (!url) return 'https://via.placeholder.com/800x600?text=No+Image';
    return (url.startsWith('/files')) ? window.location.origin + url : url;
};

const nextSlide = () => {
    if (mainStories.value.length) currentIndex.value = (currentIndex.value + 1) % mainStories.value.length;
};
const prevSlide = () => {
    if (mainStories.value.length) currentIndex.value = currentIndex.value === 0 ? mainStories.value.length - 1 : currentIndex.value - 1;
};

const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '';

onMounted(() => {
    // Start the carousel timer
    timer = setInterval(nextSlide, 5000);
});

onUnmounted(() => {
    clearInterval(timer);
});
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