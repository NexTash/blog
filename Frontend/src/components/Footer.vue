<template>
	<footer class="border-t border-white/5 bg-gray-900 px-4">
		<!-- Newsletter strip -->
		<div class="border-b border-white/10 py-10">
			<div class="mx-auto max-w-7xl flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
				<div>
					<p class="text-xs font-black uppercase tracking-[0.24em] text-[#f97316]">
						Stay in the loop
					</p>
					<h3 class="mt-1 text-xl font-black text-white">
						Get the best stories, weekly.
					</h3>
					<p class="mt-1.5 text-sm text-gray-400">
						No spam. Curated picks from our editors, straight to you.
					</p>
				</div>

				<form @submit.prevent="subscribeNewsletter" class="flex w-full max-w-md flex-col gap-2">
					<div class="flex w-full gap-2">
						<input v-model="newsletterEmail" type="email" placeholder="your@email.com" required
							:disabled="loading"
							class="flex-1 rounded-md border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-gray-500 outline-none transition-colors focus:border-[#b42318] focus:ring-1 focus:ring-[#b42318] disabled:opacity-50" />
						<button type="submit" :disabled="loading"
							class="shrink-0 rounded-md bg-[#b42318] px-5 py-3 text-xs font-black uppercase tracking-[0.14em] text-white transition-all hover:bg-[#971b12] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:hover:translate-y-0">
							<span v-if="loading">Processing...</span>
							<span v-else>{{ subscribed ? "✓ Done!" : "Subscribe" }}</span>
						</button>
					</div>
					<!-- Feedback message -->
					<p v-if="message" :class="messageType === 'error' ? 'text-red-400' : 'text-green-400'"
						class="text-[10px] uppercase font-bold tracking-widest mt-1">
						{{ message }}
					</p>
				</form>
			</div>
		</div>

		<!-- Main footer grid -->
		<div class="py-10">
			<div class="mx-auto max-w-7xl grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
				<!-- Brand column -->
				<div class="lg:col-span-2">
					<p class="text-xs font-black uppercase tracking-[0.28em] text-[#f97316]">
						Digital Magazine
					</p>
					<h2 class="mt-1 text-3xl font-black tracking-tight text-white">NextNews</h2>
					<p class="mt-3 max-w-sm text-sm leading-6 text-gray-400">
						Curated articles, creator voices, and practical insight. Stories that
						matter, from writers who care.
					</p>
					<div class="mt-5 flex items-center gap-3">
						<a href="#" class="social-icon">
							<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
								<path
									d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.736l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
							</svg>
						</a>
						<a href="#" class="social-icon">
							<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
								<path
									d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
							</svg>
						</a>
					</div>
				</div>

				<!-- Navigate column -->
				<div>
					<h4 class="mb-4 text-xs font-black uppercase tracking-[0.2em] text-gray-400">Navigate</h4>
					<nav class="flex flex-col gap-2.5">
						<router-link to="/" class="footer-link">Home</router-link>
						<a href="#" class="footer-link">Latest Stories</a>
						<a href="#" class="footer-link">Popular</a>
					</nav>
				</div>

				<!-- Legal column -->
				<div>
					<h4 class="mb-4 text-xs font-black uppercase tracking-[0.2em] text-gray-400">Company</h4>
					<nav class="flex flex-col gap-2.5">
						<a href="#" class="footer-link">About Us</a>
						<a href="#" class="footer-link">Privacy Policy</a>
						<a href="#" class="footer-link">Terms of Use</a>
					</nav>
				</div>
			</div>
		</div>

		<!-- Bottom bar -->
		<div class="border-t border-white/10 py-6 text-xs text-gray-500">
			<div class="mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-center gap-4">
				<p>&copy; {{ new Date().getFullYear() }} NextNews. All rights reserved.</p>
				<p>Powered by NexTash</p>
			</div>
		</div>
	</footer>
</template>

<script setup>
import { ref } from "vue";
import { siteApi } from "../api/siteServices";

const newsletterEmail = ref("");
const subscribed = ref(false);
const loading = ref(false);
const message = ref("");
const messageType = ref("success");

const subscribeNewsletter = async () => {
	if (!newsletterEmail.value) return;

	loading.value = true;
	message.value = "";

	try {
		const result = await siteApi.subscribeNewsletter(newsletterEmail.value.trim());

		message.value = result.message;
		messageType.value = "success";

		if (result.status === "success" || result.status === "exists") {
			subscribed.value = result.status === "success";
			newsletterEmail.value = "";
		}

		setTimeout(() => {
			subscribed.value = false;
			message.value = "";
		}, 5000);
	} catch (error) {
		messageType.value = "error";
		message.value = error.message || "Connection error. Try again later.";
	} finally {
		loading.value = false;
	}
};
</script>

<style scoped>
.social-icon {
	@apply flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-gray-400 transition-all hover:border-[#b42318] hover:bg-[#b42318]/10 hover:text-white;
}

.footer-link {
	@apply text-sm text-gray-400 transition-colors hover:text-white;
}
</style>