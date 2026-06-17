<template>
  <div class="max-w-7xl mx-auto px-4 py-12 bg-[#f2f2f2]">
    <!-- Use the prop 'posts' instead of 'blogs.data' -->
    <div v-if="posts && posts.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <article v-for="post in posts" :key="post.name"
        class="bg-white p-6 md:p-10 shadow-sm border-b-2 border-transparent hover:border-[#c80000] hover:shadow-xl transition-all duration-300 flex flex-col min-h-[250px] group">

        <!-- Categories -->
        <div class="flex flex-wrap gap-x-3 gap-y-1 mb-4">
          <span v-for="cat in getCategories(post)" :key="cat"
            class="text-[#c80000] text-[11px] font-black uppercase tracking-[0.1em]">
            {{ cat }}
          </span>
        </div>

        <!-- Title Link -->
        <router-link :to="{ name: 'PostDetail', params: { name: post.name } }">
          <h2
            class="text-[#222] text-xl md:text-2xl font-extrabold leading-tight mb-3 group-hover:text-[#c80000] transition-colors cursor-pointer">
            {{ post.title }}
          </h2>
        </router-link>

        <!-- Meta -->
        <div class="text-[#999] text-[13px] mb-5 font-semibold uppercase tracking-wide">
          {{ formatDate(post.published_on) }}
          <span class="mx-2 text-gray-300">/</span>
          <span class="text-gray-600">{{ post.blogger || 'Theme Admin' }}</span>
        </div>

        <!-- Excerpt -->
        <p class="text-[#555] text-sm md:text-base leading-relaxed line-clamp-3">
          {{ stripHtml(post.blog_intro) }}
        </p>

        <!-- Read More Link -->
        <div class="mt-auto pt-6">
          <router-link :to="{ name: 'PostDetail', params: { name: post.name } }">
            <span
              class="text-[12px] font-bold uppercase tracking-widest text-[#222] group-hover:text-[#c80000] transition-colors hover:cursor-pointer">
              Read Story +
            </span>
          </router-link>
        </div>
      </article>
    </div>
    
    <!-- Optional: Loading state based on whether posts exist yet -->
    <div v-else class="flex flex-col items-center justify-center py-20">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-[#c80000]"></div>
      <p class="mt-4 text-gray-500 font-medium">Loading stories...</p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  posts: {
    type: Array,
    default: () => []
  }
});

const stripHtml = (html) => {
  if (!html) return '';
  return html.replace(/<[^>]*>?/gm, '');
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
};

const getCategories = (post) => {
  if (!post.blog_category) return ['UNCATEGORIZED'];
  if (typeof post.blog_category === 'string') {
    return post.blog_category.split(',').map(c => c.trim());
  }
  return [post.blog_category];
};
</script>