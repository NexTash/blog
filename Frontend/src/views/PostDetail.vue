<template>
  <main class="min-h-screen bg-white">

    <!-- BREADCRUMB BAR (Dynamic) -->
    <div class="w-full bg-[#f9f9f9] border-b border-gray-200 py-3">
      <div class="max-w-4xl mx-auto">
        <nav class="flex text-md font-medium">
          <router-link to="/" class="text-[#c80000] hover:underline">Home</router-link>
          <span class="text-gray-400">/</span>
          <span v-if="currentPost" class="text-gray-600 truncate">{{ currentPost.title }}</span>
          <span v-else class="text-gray-400">Loading...</span>
        </nav>
      </div>
    </div>

    <div class="max-w-4xl mx-auto px-6 py-12 md:py-16">

      <!-- 1. LOADING STATE -->
      <div v-if="blogs.loading" class="flex flex-col items-center justify-center py-20">
        <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-[#c80000]"></div>
      </div>

      <!-- 2. ARTICLE CONTENT -->
      <article v-else-if="currentPost">
        <!-- Category -->
        <span class="text-[#c80000] text-sm font-black uppercase tracking-widest">
          {{ currentPost.blog_category || 'Uncategorized' }}
        </span>

        <!-- Title -->
        <h1 class="lg:text-[28px] md:text-5xl font-extrabold text-[#222] mt-3 mb-4 leading-tight">
          {{ currentPost.title }}
        </h1>

        <!-- Meta Info -->
        <div class="text-gray-500  font-medium mb-8">
          {{ formatDate(currentPost.published_on) }} / {{ currentPost.blogger || 'Theme Admin' }}
        </div>

        <!-- Meta Image -->
        <div v-if="currentPost.meta_image" class="mb-10">
          <img :src="currentPost.meta_image" :alt="currentPost.title"
            class="w-full h-auto rounded-sm object-cover max-h-[450px]" />
        </div>

        <!-- Blog Intro -->
        <div class="text-[#444] text-lg md:text-xl leading-relaxed mb-10 font-normal">
          {{ currentPost.blog_intro }}
        </div>

        <hr class="border-t border-gray-200 mb-12" />

        <!-- Main Content -->
        <div
          class="prose prose-lg max-w-none prose-headings:text-[#222] prose-headings:font-bold prose-p:text-[#444] prose-strong:text-black"
          v-html="currentPost.content"></div>

        <!-- Back Button -->
        <div class="mt-16 pt-8 border-t border-gray-100">
          <button @click="$router.back()"
            class="text-sm font-bold uppercase tracking-widest text-gray-400 hover:text-[#c80000] transition-colors flex items-center">
            <span class="mr-2">←</span> Back to Stories
          </button>
        </div>
      </article>

      <!-- 3. ERROR STATE -->
      <div v-else class="text-center py-20 text-gray-400">
        <p class="text-xl font-medium">Post not found.</p>
        <button @click="$router.push('/')" class="mt-4 text-[#c80000] underline">Go Home</button>
      </div>
    </div>
  </main>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { blogsResource } from '../api/blogServices.js';

const route = useRoute();
const blogs = blogsResource;

const currentPost = computed(() => {
  return blogs.data.find(p => p.name === route.params.name);
});

onMounted(() => {
  if (blogs.data.length === 0) {
    blogs.fetch();
  }
});

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric'
  });
};
</script>

<style>
/* Keeping your custom prose styling */
.prose h1 {
  font-size: 2.25rem;
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.prose h2 {
  font-size: 1.875rem;
  margin-top: 1.75rem;
  margin-bottom: 0.75rem;
}

.prose h3 {
  font-size: 1.5rem;
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
}
</style>