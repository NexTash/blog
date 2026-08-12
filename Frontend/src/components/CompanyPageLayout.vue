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
							<span class="text-[#b42318]">{{ title }}</span>
						</nav>
						<p class="kicker">{{ kicker }}</p>
						<h1 class="editorial-display mt-3 max-w-4xl text-4xl font-black tracking-tight text-gray-900 md:text-6xl">
							{{ title }}<span class="text-[#b42318]">.</span>
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
				<div
					v-if="loading"
					class="surface space-y-4 rounded-[2rem] px-6 py-8 md:px-8 md:py-10"
				>
					<div class="skeleton h-4 w-24"></div>
					<div class="skeleton h-10 w-3/4"></div>
					<div class="skeleton h-4 w-full"></div>
					<div class="skeleton h-4 w-[92%]"></div>
					<div class="skeleton h-4 w-[88%]"></div>
					<div class="skeleton h-28 w-full"></div>
				</div>

				<div
					v-else-if="error"
					class="surface rounded-[2rem] px-6 py-8 text-sm text-red-700 md:px-8 md:py-10"
				>
					{{ error }}
				</div>

				<article v-else
					class="surface overflow-hidden rounded-[2rem] border-[#eadfd3] bg-white/95 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
					<!-- <div class="border-b border-[#efe5db] bg-[#fbf6ef] px-6 py-5 md:px-8"> -->
					<!-- <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"> -->
					<!-- <div>
                                <p class="text-[10px] font-black uppercase tracking-[0.24em] text-[#b42318]">From Backend</p>
                                <h2 class="mt-2 text-2xl font-black tracking-tight text-gray-900">{{ title }}</h2>
                            </div> -->
					<!-- <p v-if="lastUpdatedLabel" class="text-xs font-bold uppercase tracking-[0.16em] text-gray-400">
                                Updated {{ lastUpdatedLabel }}
                            </p>
                        </div> -->
					<!-- </div> -->

					<div class="px-6 pb-8 pt-0 md:px-8 md:pb-10 md:pt-0">
						<div class="company-prose" v-html="renderedContent"></div>
					</div>
				</article>
			</section>
		</div>
	</main>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { siteApi } from "../api/siteServices";
import { formatDate, sanitizeHtml } from "../utils/post";

const props = defineProps({
	contentKey: {
		type: String,
		required: true,
	},
	title: {
		type: String,
		required: true,
	},
	kicker: {
		type: String,
		required: true,
	},
});

const route = useRoute();
const loading = ref(true);
const error = ref("");
const companyContent = ref({});

const companyLinks = [
	{
		name: "AboutUs",
		label: "About Us",
	},
	{
		name: "PrivacyPolicy",
		label: "Privacy Policy",
	},
	{
		name: "TermsAndConditions",
		label: "Terms and Conditions",
	},
	{
		name: "DisclosurePolicy",
		label: "Disclosure Policy",
	},
];

const resolvedRawContent = computed(() => companyContent.value?.[props.contentKey] || "");
const renderedContent = computed(() => sanitizeHtml(resolvedRawContent.value));
const lastUpdatedLabel = computed(() => {
	const modified = companyContent.value?.modified;
	return modified ? formatDate(modified, { year: "numeric", month: "long", day: "numeric" }) : "";
});

async function fetchCompanyContent() {
	loading.value = true;
	error.value = "";

	try {
		companyContent.value = (await siteApi.getAboutCompanyContent()) || {};
	} catch (err) {
		error.value = err.message || "Unable to load company content.";
		companyContent.value = {};
	} finally {
		loading.value = false;
	}
}

onMounted(fetchCompanyContent);
</script>
