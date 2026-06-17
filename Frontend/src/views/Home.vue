<template>
  <div>
    <Slider />

    <MainStories :posts="blogs.data" />
    <PopularStories :posts="blogs.data" />
    <Stories :posts="blogs.data" />
    <MissedStories :posts="blogs.data" />
  </div>
</template>

<script setup>
import { blogsResource } from '../api/blogServices.js';
import Slider from '../components/Slider.vue';
import MainStories from '../components/MainStories.vue';
import PopularStories from '../components/PopularStories.vue';
import Stories from '../components/Stories.vue';
import MissedStories from '../components/MissedStories.vue';

const blogs = blogsResource;
</script>