<template>
	<footer class="border-t border-white/5 bg-gray-900 px-4 py-10">
		<div class="mx-auto max-w-7xl">
			<!-- Brand row -->
			<div class="mb-8 flex flex-col items-start gap-4 border-b border-white/10 pb-8 md:flex-row md:items-end md:justify-between">
				<div>
					<p class="text-xs font-black uppercase tracking-[0.28em] text-[#f97316]">Digital Magazine</p>
					<h2 class="mt-1 text-3xl font-black tracking-tight text-white">NextNews</h2>
					<p class="mt-2 max-w-sm text-sm leading-6 text-gray-400">
						Curated articles, creator voices, and practical insight.
					</p>
				</div>

				<nav class="flex flex-wrap gap-x-6 gap-y-2 text-xs font-black uppercase tracking-[0.18em]" aria-label="Footer navigation">
					<router-link to="/" class="text-gray-400 transition-colors hover:text-white">Home</router-link>
					<a href="#latest" class="text-gray-400 transition-colors hover:text-white">Latest</a>
					<a href="#popular" class="text-gray-400 transition-colors hover:text-white">Popular</a>
					<a href="#all-stories" class="text-gray-400 transition-colors hover:text-white">Stories</a>
				</nav>
			</div>

			<!-- Copyright row -->
			<div class="flex flex-col items-start gap-2 text-xs font-medium text-gray-500 md:flex-row md:items-center md:justify-between">
				<p>
					&copy; {{ new Date().getFullYear() }}
					<a href="#" class="text-gray-400 transition-colors hover:text-white hover:underline">NextNews</a>.
					All rights reserved.
				</p>
				<p class="flex flex-wrap items-center gap-1">
					<span>Theme by</span>
					<a href="#" class="text-gray-400 transition-colors hover:text-white hover:underline">Usman</a>
					<span class="hidden text-gray-600 md:inline">.</span>
					<span>Powered by</span>
					<a href="#" class="text-gray-400 transition-colors hover:text-white hover:underline">NexTash</a>
				</p>
			</div>
		</div>
	</footer>
</template>

<script setup>
// no logic needed
</script>
