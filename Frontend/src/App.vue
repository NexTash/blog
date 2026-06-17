
<template>
  <div class="font-sans bg-white">
    <Header />
    <Navbar />
    <div v-if="blogs.loading" class="loading-overlay">Loading...</div>

    <router-view /> 

    <Footer />
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { blogsResource } from './api/blogServices.js'; 
import Header from './components/Header.vue';
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';

const blogs = blogsResource;

onMounted(() => {
  blogs.fetch();
});
</script>