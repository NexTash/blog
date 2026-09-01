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
import { computed, onMounted, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import { blogsResource } from "./api/blogServices.js";
import { isOutboundHref, openOutbound } from "./utils/outbound.js";
import Header from "./components/Header.vue";
import Navbar from "./components/Navbar.vue";
import Slider from "./components/Slider.vue";
import Footer from "./components/Footer.vue";

const blogs = blogsResource;
const route = useRoute();

// Auth pages skip the news Navbar + Slider (but keep Header + Footer)
const AUTH_PAGES = ["Login", "Signup", "ForgotPassword", "ResetPassword"];
const isAuthPage = computed(() => AUTH_PAGES.includes(route.name));

// ---------------------------------------------------------------------------
// Delegated outbound handler for v-html rendered content
//
// Vue directives (v-outbound) cannot be applied to markup injected via v-html.
// Instead we attach a single document-level click listener that intercepts:
//
//   1. Any <a> inside .article-content  — inline links written by authors
//   2. Any <a data-outbound>            — CTA buttons built by normalizeInlineCtaBlocks
//
// A single delegated listener is far cheaper than per-element listeners and
// automatically covers content that mounts/unmounts as the user navigates.
// ---------------------------------------------------------------------------
function handleDelegatedOutbound(event) {
	// Walk up from the click target to the nearest <a>
	const link = event.target.closest("a");
	if (!link) return;

	const href = link.getAttribute("href");
	if (!isOutboundHref(href)) return;

	// Only intercept links inside the article body OR links explicitly marked
	const inArticle = link.closest(".article-content") !== null;
	const isMarked  = link.hasAttribute("data-outbound");

	if (!inArticle && !isMarked) return;

	event.preventDefault();

	const target = link.getAttribute("target") ?? "_blank";
	openOutbound(href, target);
}

onMounted(() => {
	blogs.fetch();
	// Passive: no need to call preventDefault from the capture phase,
	// we use bubble phase so event.preventDefault() in the handler still works.
	document.addEventListener("click", handleDelegatedOutbound);
});

onUnmounted(() => {
	document.removeEventListener("click", handleDelegatedOutbound);
});
</script>
