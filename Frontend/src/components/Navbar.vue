<template>
	<nav class="sticky z-20 top-0 border-b border-gray-200 bg-white/95 text-gray-900 shadow-sm backdrop-blur">
		<div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
			<div class="flex h-14 items-center justify-between">
				<!-- Desktop nav links + hamburger -->
				<div class="flex items-center gap-2 md:gap-8">
					<button @click="isMobileMenuOpen = !isMobileMenuOpen"
						class="flex h-10 w-10 items-center justify-center md:hidden" :aria-expanded="isMobileMenuOpen"
						aria-label="Toggle menu">
						<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path v-if="!isMobileMenuOpen" stroke-linecap="round" stroke-linejoin="round"
								stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
							<path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
								d="M6 18L18 6M6 6l12 12" />
						</svg>
					</button>

					<div class="hidden items-center gap-1 text-sm font-black uppercase tracking-[0.12em] md:flex">
						<router-link to="/" class="nav-link"
							active-class="text-[#b42318] bg-[#fff4f1]">Home</router-link>
						<div class="relative" @mouseenter="isCategoryMenuOpen = true"
							@mouseleave="isCategoryMenuOpen = false">
							<button type="button" class="nav-link flex items-center gap-2" @click="toggleCategoryMenu"
								:aria-expanded="isCategoryMenuOpen" aria-haspopup="menu">
								Category
								<svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
									<path fill-rule="evenodd"
										d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
										clip-rule="evenodd" />
								</svg>
							</button>
							<div v-if="isCategoryMenuOpen"
								class="absolute left-0 top-full z-50 w-60 overflow-hidden rounded-lg border border-gray-200 bg-white py-2 shadow-lg">
								<router-link v-for="category in categories" :key="category.name"
									:to="categoryRoute(category)"
									class="block px-4 py-2.5 text-sm font-semibold normal-case tracking-normal text-gray-700 hover:bg-gray-50 hover:text-[#b42318]"
									@click="closeCategoryMenu">
									{{ category.label }}
								</router-link>
								<p v-if="categories.length === 0" class="px-4 py-2.5 text-sm text-gray-400">
									No categories found
								</p>
							</div>
						</div>
						<a href="#" class="nav-link" @click="closeMobile">Guides</a>
						<a href="#" class="nav-link" @click="closeMobile">About Us</a>
					</div>
				</div>

				<!-- Search button -->
				<button @click="toggleSearch" :class="isSearchOpen ? 'bg-gray-900 text-white' : 'hover:bg-gray-100'"
					class="flex h-10 w-10 items-center justify-center rounded-full transition-colors"
					:aria-label="isSearchOpen ? 'Close search' : 'Open search'">
					<svg v-if="!isSearchOpen" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
						viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
						<path stroke-linecap="round" stroke-linejoin="round"
							d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
					</svg>
					<svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
						stroke="currentColor" stroke-width="3">
						<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			</div>
		</div>

		<!-- Search panel -->
		<transition name="slide-fade">
			<div v-if="isSearchOpen" class="absolute right-0 top-full z-50 w-full sm:right-4 sm:w-[460px]">
				<div class="surface rounded-t-none p-4">
					<div class="flex overflow-hidden rounded-md border border-gray-300 bg-white">
						<input v-model="search" type="text" placeholder="Search blogs…"
							class="w-full px-4 py-3 text-sm font-medium text-gray-700 outline-none" v-focus
							@keydown.enter="doSearch" />
						<button @click="doSearch"
							class="bg-[#b42318] px-4 text-sm font-bold text-white transition-colors hover:bg-[#971b12]">
							Search
						</button>
					</div>

					<!-- Search results -->
					<div v-if="searchResults.length > 0" class="mt-2 max-h-72 overflow-y-auto">
						<router-link v-for="post in searchResults" :key="post.name"
							:to="{ name: 'PostDetail', params: { name: post.name } }"
							class="flex items-start gap-3 border-b border-gray-100 px-3 py-3 transition-colors last:border-0 hover:bg-gray-50"
							@click="closeSearch">
							<img :src="getImageUrl(post.meta_image)" :alt="post.title"
								class="h-12 w-12 shrink-0 rounded-md object-cover" />
							<div class="min-w-0">
								<p class="line-clamp-1 text-sm font-bold text-gray-900">
									{{ post.title }}
								</p>
								<p class="mt-0.5 text-[11px] font-bold uppercase tracking-wider text-[#b42318]">
									{{ post.blog_category || "General" }}
								</p>
							</div>
						</router-link>
					</div>
					<p v-else-if="search.trim().length > 1" class="mt-2 px-3 py-3 text-sm text-gray-400">
						No blogs found for "{{ search }}"
					</p>
				</div>
			</div>
		</transition>

		<!-- Mobile menu -->
		<transition name="slide-fade">
			<div v-if="isMobileMenuOpen" class="border-t border-gray-200 bg-white px-4 py-3 shadow-lg md:hidden">
				<router-link to="/" class="mobile-link" @click="closeMobile">Home</router-link>
				<a href="#latest" class="mobile-link" @click="closeMobile">Latest</a>
				<a href="#popular" class="mobile-link" @click="closeMobile">Popular</a>
				<div class="mt-1 border-t border-gray-100 pt-2">
					<p class="px-3 pb-1 text-[11px] font-black uppercase tracking-[0.14em] text-gray-400">
						Categories
					</p>
					<router-link v-for="category in categories" :key="`mobile-${category.name}`"
						:to="categoryRoute(category)" class="mobile-link" @click="closeMobile">
						{{ category.label }}
					</router-link>
					<p v-if="categories.length === 0" class="px-3 py-2 text-sm text-gray-400">
						No categories found
					</p>
				</div>
			</div>
		</transition>
	</nav>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { blogsResource, categoriesResource } from "../api/blogServices.js";
import { getImageUrl } from "../utils/post";

const isSearchOpen = ref(false);
const isMobileMenuOpen = ref(false);
const isCategoryMenuOpen = ref(false);
const search = ref("");

const toggleSearch = () => {
	isSearchOpen.value = !isSearchOpen.value;
	if (!isSearchOpen.value) search.value = "";
};

const closeSearch = () => {
	isSearchOpen.value = false;
	search.value = "";
};

const closeMobile = () => {
	isMobileMenuOpen.value = false;
};

const toggleCategoryMenu = () => {
	isCategoryMenuOpen.value = !isCategoryMenuOpen.value;
};

const closeCategoryMenu = () => {
	isCategoryMenuOpen.value = false;
};

const categoryRoute = (category) => ({
	name: "Category",
	params: {
		slug: typeof category === "string" ? category : category?.name,
	},
});

const doSearch = () => {
	// Results update reactively; just ensure panel is open
};

const searchResults = computed(() => {
	const q = search.value.trim().toLowerCase();
	if (q.length < 2) return [];
	return (blogsResource.data || [])
		.filter(
			(p) =>
				p.title?.toLowerCase().includes(q) ||
				p.blog_category?.toLowerCase().includes(q) ||
				p.blog_intro?.toLowerCase().includes(q) ||
				p.content?.toLowerCase().includes(q),
		)
		.slice(0, 6);
});

const categories = computed(() => {
	if ((categoriesResource.data || []).length) {
		return categoriesResource.data.map((category) => ({
			name: category.name,
			label: category.title || category.name,
		}));
	}

	const fallbackItems = (blogsResource.data || [])
		.map((post) => post.blog_category)
		.filter((category) => typeof category === "string" && category.trim().length > 0);

	return [...new Set(fallbackItems)].map((category) => ({
		name: category,
		label: category,
	}));
});

const vFocus = {
	mounted: (el) => el.focus(),
};

onMounted(() => {
	blogsResource.fetch();
	categoriesResource.fetch();
});
</script>

<style scoped>
.nav-link {
	@apply rounded-full px-4 py-2 text-gray-700 transition-colors hover:bg-gray-100 hover:text-[#b42318];
}

.mobile-link {
	@apply block rounded-md px-3 py-2.5 text-sm font-black uppercase tracking-[0.14em] text-gray-700 hover:bg-gray-100 hover:text-[#b42318];
}

.slide-fade-enter-active {
	transition: all 0.18s ease-out;
}

.slide-fade-leave-active {
	transition: all 0.12s ease-in;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
	transform: translateY(-8px);
	opacity: 0;
}
</style>
