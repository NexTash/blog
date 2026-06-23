<template>
	<div class="min-h-screen bg-[#f6f3ee] font-sans text-gray-900">
		<!-- Global top-loading bar -->
		<div v-if="blogs.loading" class="fixed inset-x-0 top-0 z-[70] h-1 bg-[#b42318]">
			<div class="h-full w-1/3 animate-pulse bg-white/70"></div>
		</div>

		<Header />
		<template v-if="!isAuthPage">
			<Navbar />
			<Slider />
		</template>

		<router-view />

		<Footer />
	</div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useRoute } from "vue-router";
import { blogsResource } from "./api/blogServices.js";
import Header from "./components/Header.vue";
import Navbar from "./components/Navbar.vue";
import Slider from "./components/Slider.vue";
import Footer from "./components/Footer.vue";

const blogs = blogsResource;
const route = useRoute();

// Auth pages skip the news Navbar + Slider (but keep Header + Footer)
const AUTH_PAGES = ["Login", "Signup", "ForgotPassword", "ResetPassword"];
const isAuthPage = computed(() => AUTH_PAGES.includes(route.name));

onMounted(() => {
	blogs.fetch();
});
</script>
