<template>
	<main class="min-h-screen bg-[#f6f3ee] px-4 py-10 md:px-6 md:py-14">
		<div class="mx-auto max-w-7xl">
			<section
				class="relative overflow-hidden rounded-[2.5rem] border border-[#e9ddd0] bg-[radial-gradient(circle_at_top_left,_rgba(180,35,24,0.14),_transparent_36%),linear-gradient(135deg,#fffdf8_0%,#f7efe5_52%,#f4e6da_100%)] px-6 py-8 shadow-[0_20px_70px_rgba(15,23,42,0.08)] md:px-10 md:py-12"
			>
				<div class="absolute -right-16 top-0 h-48 w-48 rounded-full bg-[#b42318]/10 blur-3xl"></div>
				<div class="absolute bottom-0 left-0 h-32 w-full bg-[linear-gradient(90deg,rgba(180,35,24,0.08),transparent_45%)]"></div>

				<div class="relative grid gap-8">
					<div>
						<nav class="mb-5 flex flex-wrap items-center gap-2 text-[11px] font-black uppercase tracking-[0.18em] text-gray-500">
							<router-link to="/" class="transition-colors hover:text-[#b42318]">Home</router-link>
							<span>/</span>
							<span class="text-[#b42318]">Disclosure Policy</span>
						</nav>
						<p class="kicker">Disclosure</p>
						<h1 class="editorial-display mt-3 max-w-4xl text-4xl font-black tracking-tight text-gray-900 md:text-6xl">
							Disclosure Policy<span class="text-[#b42318]">.</span>
						</h1>
					</div>

					<nav class="grid gap-3 sm:grid-cols-4">
						<router-link
							v-for="link in companyLinks"
							:key="link.name"
							:to="{ name: link.name }"
							class="rounded-[1.5rem] border px-5 py-4 text-left transition-all"
							:class="
								route.name === link.name
									? 'border-[#b42318] bg-white text-[#b42318] shadow-sm'
									: 'border-white/70 bg-white/80 text-gray-700 hover:border-[#d7c6b6] hover:bg-[#fcf8f2]'
							"
						>
							<p class="text-[11px] font-black uppercase tracking-[0.18em]">{{ link.label }}</p>
						</router-link>
					</nav>
				</div>
			</section>

			<section class="mt-10">
				<article
					class="surface overflow-hidden rounded-[2rem] border-[#eadfd3] bg-white/95 shadow-[0_24px_80px_rgba(15,23,42,0.08)]"
				>
					<div class="px-6 py-8 md:px-8 md:py-10">
						<div class="company-prose">
							<h1>Disclosure Policy</h1>
							<p>
								Some links in this article may point to partner products or services. If you choose to use them,
								we may earn a commission at no extra cost to you. Our editorial content is written to be useful,
								clear, and independent regardless of any partner relationship.
							</p>
						</div>
					</div>
				</article>
			</section>
		</div>
	</main>
</template>

<script setup>
import { useRoute } from "vue-router";

const route = useRoute();

const companyLinks = [
	{ name: "AboutUs", label: "About Us" },
	{ name: "PrivacyPolicy", label: "Privacy Policy" },
	{ name: "TermsAndConditions", label: "Terms and Conditions" },
	{ name: "DisclosurePolicy", label: "Disclosure Policy" },
];
</script>
