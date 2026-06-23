<template>
	<footer class="border-t border-white/5 bg-gray-900 px-4">
		<!-- Newsletter strip -->
		<div class="border-b border-white/10 py-10">
			<div
				class="mx-auto max-w-7xl flex flex-col gap-6 md:flex-row md:items-center md:justify-between"
			>
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
				<form @submit.prevent="subscribeNewsletter" class="flex w-full max-w-md gap-2">
					<input
						v-model="newsletterEmail"
						type="email"
						placeholder="your@email.com"
						class="flex-1 rounded-md border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-gray-500 outline-none transition-colors focus:border-[#b42318] focus:ring-1 focus:ring-[#b42318]"
					/>
					<button
						type="submit"
						class="shrink-0 rounded-md bg-[#b42318] px-5 py-3 text-xs font-black uppercase tracking-[0.14em] text-white transition-all hover:bg-[#971b12] hover:-translate-y-0.5 active:translate-y-0"
					>
						{{ subscribed ? "✓ Done!" : "Subscribe" }}
					</button>
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
					<!-- Social links -->
					<div class="mt-5 flex items-center gap-3">
						<a href="#" aria-label="Twitter / X" class="social-icon">
							<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
								<path
									d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.736l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
								/>
							</svg>
						</a>
						<a href="#" aria-label="LinkedIn" class="social-icon">
							<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
								<path
									d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
								/>
							</svg>
						</a>
						<a href="#" aria-label="RSS Feed" class="social-icon">
							<svg class="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
								<path
									d="M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19.01 7.38 20 6.18 20C4.98 20 4 19.01 4 17.82a2.18 2.18 0 0 1 2.18-2.18M4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44m0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93V10.1z"
								/>
							</svg>
						</a>
					</div>
				</div>

				<!-- Navigate column -->
				<div>
					<h4 class="mb-4 text-xs font-black uppercase tracking-[0.2em] text-gray-400">
						Navigate
					</h4>
					<nav class="flex flex-col gap-2.5">
						<router-link to="/" class="footer-link">Home</router-link>
						<a href="#latest" class="footer-link">Latest Stories</a>
						<a href="#popular" class="footer-link">Popular</a>
						<a href="#all-stories" class="footer-link">All Stories</a>
					</nav>
				</div>

				<!-- Legal column -->
				<div>
					<h4 class="mb-4 text-xs font-black uppercase tracking-[0.2em] text-gray-400">
						Company
					</h4>
					<nav class="flex flex-col gap-2.5">
						<a href="#" class="footer-link">About Us</a>
						<a href="#" class="footer-link">Write for Us</a>
						<a href="#" class="footer-link">Privacy Policy</a>
						<a href="#" class="footer-link">Terms of Use</a>
					</nav>
				</div>
			</div>
		</div>

		<!-- Bottom bar -->
		<div class="border-t border-white/10 py-6">
			<div
				class="mx-auto max-w-7xl flex flex-col items-start gap-2 text-xs font-medium text-gray-500 md:flex-row md:items-center md:justify-between"
			>
				<p>
					&copy; {{ new Date().getFullYear() }}
					<a
						href="#"
						class="text-gray-400 transition-colors hover:text-white hover:underline"
						>NextNews</a
					>. All rights reserved.
				</p>
				<p class="flex flex-wrap items-center gap-1">
					<span>Crafted by</span>
					<a
						href="#"
						class="text-gray-400 transition-colors hover:text-white hover:underline"
						>Usman</a
					>
					<span class="hidden text-gray-600 md:inline">·</span>
					<span>Powered by</span>
					<a
						href="#"
						class="text-gray-400 transition-colors hover:text-white hover:underline"
						>NexTash</a
					>
				</p>
			</div>
		</div>
	</footer>
</template>

<script setup>
import { ref } from "vue";

const newsletterEmail = ref("");
const subscribed = ref(false);

const subscribeNewsletter = () => {
	if (!newsletterEmail.value) return;
	// Placeholder — wire up to a real API endpoint as needed
	subscribed.value = true;
	newsletterEmail.value = "";
	setTimeout(() => {
		subscribed.value = false;
	}, 3000);
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
