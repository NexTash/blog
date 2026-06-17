<template>
    <section class="max-w-7xl mx-auto px-4 py-8 bg-[#f9f9f9]">
        <div class="flex items-center mb-6">
            <div class="w-[3px] h-6 bg-[#c80000] mr-3"></div>
            <h2 class="text-xl font-extrabold text-[#222] tracking-tight uppercase">You may Missed</h2>
        </div>

        <div v-if="missedPosts.length > 0"
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[1px] bg-gray-200 border border-gray-200 shadow-sm">
            <div v-for="post in missedPosts" :key="post.name"
                class="bg-white p-6 hover:bg-gray-50 transition-all cursor-pointer group">
                <span class="block text-[11px] font-black text-[#c80000] uppercase tracking-wider mb-2">
                    {{ post.blog_category || 'Uncategorized' }}
                </span>

                <router-link :to="{ name: 'PostDetail', params: { name: post.name } }">
                    <h3
                        class="text-lg font-bold text-[#222] leading-snug mb-3 group-hover:text-[#c80000] transition-colors line-clamp-2">
                        {{ post.title }}
                    </h3>
                </router-link>

                <div class="text-[13px] text-gray-500 font-medium uppercase">
                    {{ formatDate(post.published_on) }} <span class="mx-1">/</span> {{ post.blogger || 'Admin' }}
                </div>
            </div>
        </div>
        <div v-else class="text-center py-10 text-gray-400 italic">Loading...</div>
    </section>
</template>


<script setup>
import { computed } from 'vue';

const props = defineProps({
    posts: {
        type: Array,
        required: true,
        default: () => []
    }
});

/**
 * We take a different slice of data than "Popular Stories" 
 * so the user sees different content. 
 * Here we take index 4 to 8.
 */
const missedPosts = computed(() => {
    return props.posts ? props.posts.slice(4, 8) : [];
});

const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};
</script>

<style scoped>
/* Standard line clamping for multi-line titles */
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
