<template>
	<HomeSkeleton v-if="blogs.loading && !blogs.fetched" />

	<ErrorState
		v-else-if="blogs.error && !blogs.data.length"
		title="Could not load blogs"
		:message="blogs.error"
		@retry="fetchHome(true)"
	/>

	<div
		v-else-if="!blogs.data.length"
		class="bg-[#f6f3ee] px-4 py-12"
	>
		<div class="surface mx-auto max-w-3xl px-6 py-16 text-center">
			<p class="kicker">No Blogs Yet</p>
			<h2 class="mt-2 text-2xl font-black tracking-tight text-gray-900">
				Nothing has been published yet.
			</h2>
			<p class="mt-3 text-sm leading-6 text-gray-500">
				Once blogs are approved, they will appear here.
			</p>
		</div>
	</div>

	<main v-else>
		<ErrorState
			v-if="blogs.error"
			title="Blogs may be out of date"
			:message="blogs.error"
			@retry="fetchHome(true)"
		/>
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
import ErrorState from "../components/ErrorState.vue";
import HomeSkeleton from "../components/HomeSkeleton.vue";
import MainStories from "../components/MainStories.vue";
import PopularStories from "../components/PopularStories.vue";
import Stories from "../components/Stories.vue";
import MissedStories from "../components/MissedStories.vue";
import AdPosts from "../components/AdPosts.vue";

const blogs = blogsResource;
const ads = adsResource;

const fetchHome = (force = false) => blogs.fetch(force);

onMounted(() => {
	fetchHome();
	ads.fetch();
});
</script>
