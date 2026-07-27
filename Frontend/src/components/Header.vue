<template>
	<header class="relative z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur">
		<!-- Top bar: date + tagline -->
		<div class="bg-gray-900 px-4 py-2 text-white md:px-8">
			<div
				class="mx-auto flex max-w-7xl items-center justify-between gap-4 text-[11px] font-bold uppercase tracking-[0.16em] text-gray-300 sm:text-xs">
				<span>{{ formattedDate }}</span>
				<span class="hidden items-center gap-2 sm:flex">
					<span class="inline-block h-1 w-1 rounded-full bg-[#f97316]"></span>
					UPDATED WEEKLY · REAL RATES · REAL SAVINGS
				</span>
			</div>
		</div>

		<!-- Brand + auth actions -->
		<div class="px-4 py-4 md:px-4 md:py-4">
			<div class="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between">
				<!-- Brand -->
				<router-link to="/" class="group max-w-2xl">
					<!-- <p class="kicker mb-2">GUIDES & RESOURCES</p> -->
					<h1
						class="text-2xl md:text-2xl lg:text-3xl font-black tracking-tight text-gray-900 transition-colors group-hover:text-[#b42318]" style="font-weight:900">
						LeadOrbitUSA
					</h1>
					<p class="mt-3 max-w-xl text-sm leading-6 text-[#b42318] md:text-base">
						Helping you spend smarter on the decisions that matter most.
					</p>
				</router-link>

				<!-- Guest actions -->
				<div v-if="!auth?.isLoggedIn"
					class="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
					<button @click="goToLogin" class="btn-secondary">Sign In</button>
					<button @click="goToSignup" class="btn-primary">
						<svg class="mr-1.5 h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"
							stroke-width="2.5">
							<path stroke-linecap="round" stroke-linejoin="round"
								d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
						</svg>
						Get Started
					</button>
				</div>

				<!-- Authenticated actions -->
				<div v-else class="flex w-full flex-col items-start gap-4 md:items-end">
					<div
						class="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
						<button v-if="isAdministrator" @click="goToBackendPosts" class="btn-secondary gap-1.5">
							<svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"
								stroke-width="2.5">
								<path stroke-linecap="round" stroke-linejoin="round"
									d="M3 7h18M6 7v13h12V7M9 11h6M9 15h6M10 3h4a2 2 0 012 2v2H8V5a2 2 0 012-2z" />
							</svg>
							Backend Posts
						</button>
						<button @click="goToCreatePost" class="btn-primary gap-1.5">
							<svg class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"
								stroke-width="2.5">
								<path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
							</svg>
							New Story
						</button>
						<div class="relative z-[60]">
							<button @click="toggleUserMenu"
								class="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-2 py-1.5 shadow-sm transition-colors hover:border-[#b42318]">
								<span
									class="flex h-9 w-9 items-center justify-center rounded-full bg-[#b42318] text-sm font-black uppercase text-white">
									{{ userInitial }}
								</span>
								<svg class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"
									stroke-width="2">
									<path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
								</svg>
							</button>
							<div v-if="userMenuOpen"
								class="absolute right-0 z-[9999] mt-2 w-56 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-xl shadow-gray-300/60">
								<button @click="goToProfile"
									class="block w-full px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-50">
									Profile
								</button>
								<button @click="goToMyBlogs"
									class="block w-full px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-50">
									My Blogs
								</button>
								<button @click="handleLogout"
									class="block w-full px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-50">
									Sign Out
								</button>
							</div>
						</div>

					</div>

				</div>
			</div>
		</div>

		<!-- Decorative accent line -->
		<div class="h-[3px] w-full bg-gradient-to-r from-[#b42318] via-[#f97316] to-transparent"></div>
	</header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, inject, watch } from "vue";
import { useRouter } from "vue-router";
import { siteApi } from "../api/siteServices";

const router = useRouter();
const now = ref(new Date());
const auth = inject("$auth", null);
const currentUser = ref(auth?.user || auth?.cookie?.user_id || null);
const userMenuOpen = ref(false);

const goToLogin = () => router.push("/login");
const goToSignup = () => router.push("/signup");
const goToCreatePost = () => router.push("/create-post");
const goToProfile = () => {
	router.push("/my-profile");
	userMenuOpen.value = false;
};
const goToMyBlogs = () => {
	router.push("/my-blogs");
	userMenuOpen.value = false;
};
const toggleUserMenu = () => {
	userMenuOpen.value = !userMenuOpen.value;
};
const goToBackendPosts = () => {
	// router.push("/app/nextnews-workspace")
	window.location.href = "/app/nextnews-workspace";
};
// const isAdministrator = computed(() => {
// 	const allowedAdmins = ["Administrator", "admin@admin.com"];
// 	return allowedAdmins.includes(currentUser.value);
// });

const userRoles = ref([]);

const normalizeRoles = (value) => {
	if (!value) return [];
	if (Array.isArray(value)) return value.filter(Boolean);
	if (Array.isArray(value.roles)) return value.roles.filter(Boolean);
	if (Array.isArray(value.data)) return value.data.filter(Boolean);
	return [];
};

const isAdministrator = computed(() => {
	const allowedRoles = ["System Manager"];
	const currentValue = currentUser.value;
	const roleList = [
		...normalizeRoles(userRoles.value),
		...normalizeRoles(currentValue),
	];

	if (roleList.some((role) => allowedRoles.includes(role))) return true;

	const identifier =
		typeof currentValue === "string"
			? currentValue
			: currentValue?.email || currentValue?.username || currentValue?.name || "";

	return ["admin@admin.com", "Administrator"].includes(identifier);
});



const handleLogout = async () => {
	await auth?.logout?.();
	userMenuOpen.value = false;
	router.push("/");
};

const formattedDate = computed(() =>
	now.value.toLocaleDateString("en-US", {
		weekday: "long",
		month: "long",
		day: "numeric",
		year: "numeric",
	}),
);

const userDisplayName = computed(() => {
	const value = currentUser.value;
	if (!value) return "User";
	if (typeof value === "string") return value;
	return value.first_name || value.username || value.email || "User";
});

const userInitial = computed(() => userDisplayName.value.charAt(0).toUpperCase());

async function refreshCurrentUser() {
	if (!auth?.isLoggedIn) {
		currentUser.value = null;
		return;
	}

	try {
		currentUser.value = (await siteApi.getCurrentUser()) || auth?.cookie?.user_id || null;
	} catch {
		currentUser.value = auth?.cookie?.user_id || null;
	}
}

async function refreshCurrentUserRoles() {
	if (!auth?.isLoggedIn) {
		userRoles.value = [];
		return;
	}
	try {
		userRoles.value = normalizeRoles(await siteApi.getCurrentUserRoles());
	} catch {
		userRoles.value = [];
	}
}

let timer;
onMounted(() => {
	refreshCurrentUser();
	refreshCurrentUserRoles();
	timer = setInterval(() => {
		now.value = new Date();
	}, 60000);
});
onUnmounted(() => clearInterval(timer));

watch(
	() => auth?.isLoggedIn,
	() => {
		refreshCurrentUser();
		refreshCurrentUserRoles();
	},
);
</script>
