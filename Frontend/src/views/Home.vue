<template>
	<main>
		<MainStories :posts="blogs.data" />
		<PopularStories :posts="blogs.data" />

		<AdPosts :adsResource="ads" />

		<Stories :posts="blogs.data" />
		<MissedStories :posts="blogs.data" />
	</main>
</template>

<script setup>
import { onMounted } from "vue";
import { blogsResource, adsResource } from "../api/blogServices.js";
import MainStories from "../components/MainStories.vue";
import PopularStories from "../components/PopularStories.vue";
import Stories from "../components/Stories.vue";
import MissedStories from "../components/MissedStories.vue";
import AdPosts from "../components/AdPosts.vue";

const blogs = blogsResource;
const ads = adsResource;

onMounted(() => {
	blogs.fetch();
	ads.fetch();
});
</script>