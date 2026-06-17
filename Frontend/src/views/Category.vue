<template>
  <main class="max-w-7xl mx-auto px-4 py-10">
    <div class="border-b-2 border-[#1a4d32] pb-2 mb-8">
      <h2 class="text-sm font-bold uppercase tracking-widest">{{ categoryTitle }}</h2>
    </div>

    <div v-if="posts.length" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      <div v-for="post in posts" :key="post.name"
        class="cursor-pointer group" @click="$router.push(`/post/${post.name}`)">
        <img v-if="post.meta_image" :src="post.meta_image" :alt="post.title"
          class="w-full h-44 object-cover mb-3 group-hover:opacity-90 transition-opacity" />
        <div v-else class="w-full h-44 bg-gray-200 mb-3"></div>
        <span class="text-xs font-bold uppercase text-[#d34027]">{{ post.blog_category }}</span>
        <h3 class="font-semibold mt-1 group-hover:text-[#d34027] transition-colors leading-snug">{{ post.title }}</h3>
        <p class="text-xs text-gray-500 mt-1">{{ formatDate(post.published_on) }}</p>
        <p v-if="post.blog_intro" class="text-sm text-gray-600 mt-2 line-clamp-2">{{ post.blog_intro }}</p>
      </div>
    </div>

    <div v-else-if="loading" class="text-center py-20 text-gray-400">Loading...</div>
    <div v-else class="text-center py-20 text-gray-400">No posts found in this category.</div>
  </main>
</template>

<script>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { blogsResource, categoriesResource } from '../api/blogServices.js';

export default {
  name: 'Category',
  setup() {
    const route = useRoute();

    blogsResource.fetch();
    categoriesResource.fetch();

    const categoryTitle = computed(() => {
      const cat = (categoriesResource.data || []).find(c => c.name === route.params.slug);
      return cat ? cat.title : route.params.slug;
    });

    const loading = computed(() => blogsResource.loading);

    const posts = computed(() => {
      const all = blogsResource.data || [];
      return all.filter(p => p.blog_category === route.params.slug);
    });

    const formatDate = (d) => {
      if (!d) return '';
      return new Date(d).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    };

    return { categoryTitle, posts, loading, formatDate };
  }
};
</script>
