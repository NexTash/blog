<template>
	<header class="w-full border-b border-gray-200 bg-white/95 backdrop-blur">
		<!-- Top bar: date + tagline -->
		<div class="bg-gray-900 px-4 py-2 text-white md:px-8">
			<div
				class="mx-auto flex max-w-7xl items-center justify-between gap-4 text-[11px] font-bold uppercase tracking-[0.16em] text-gray-300 sm:text-xs"
			>
				<span>{{ formattedDate }}</span>
				<span class="hidden items-center gap-2 sm:flex">
					<span class="inline-block h-1 w-1 rounded-full bg-[#f97316]"></span>
					Independent stories, fresh perspectives
				</span>
			</div>
		</div>

		<!-- Brand + auth actions -->
		<div class="px-4 py-4 md:px-4 md:py-4">
			<div
				class="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center md:justify-between"
			>
				<!-- Brand -->
				<router-link to="/" class="group max-w-2xl">
					<p class="kicker mb-2">Digital Magazine</p>
					<h1
						class="text-4xl font-black tracking-tight text-gray-900 transition-colors group-hover:text-[#b42318] md:text-6xl"
					>
						NextNews
					</h1>
					<p class="mt-3 max-w-xl text-sm leading-6 text-gray-500 md:text-base">
						Curated articles, creator voices, and practical insight from the latest
						posts.
					</p>
				</router-link>

				<!-- Guest actions -->
				<div v-if="!auth?.isLoggedIn" class="flex flex-wrap items-center gap-3">
					<button @click="goToLogin" class="btn-secondary">Sign In</button>
					<button @click="goToSignup" class="btn-primary">
						<svg
							class="mr-1.5 h-3.5 w-3.5"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							stroke-width="2.5"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
							/>
						</svg>
						Get Started
					</button>
				</div>

				<!-- Authenticated actions -->
				<div v-else class="flex flex-col items-start gap-4 md:items-end">
					<div class="flex flex-wrap items-center gap-3">
						<button
							v-if="isAdministrator"
							@click="goToBackendPosts"
							class="btn-secondary gap-1.5"
						>
							<svg
								class="h-3.5 w-3.5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								stroke-width="2.5"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M3 7h18M6 7v13h12V7M9 11h6M9 15h6M10 3h4a2 2 0 012 2v2H8V5a2 2 0 012-2z"
								/>
							</svg>
							Backend Posts
						</button>
						<button @click="goToCreatePost" class="btn-primary gap-1.5">
							<svg
								class="h-3.5 w-3.5"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								stroke-width="2.5"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M12 4v16m8-8H4"
								/>
							</svg>
							New Story
						</button>
						<!-- <div class="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-2"> -->
						<!-- <div class="flex h-6 w-6 items-center justify-center rounded-full bg-[#b42318] text-[10px] font-black text-white uppercase">
								{{ (auth.user || "?")[0] }}
							</div> -->
						<!-- <span class="max-w-[180px] truncate text-xs font-black uppercase tracking-[0.12em] text-gray-700">
								{{ auth.user }}
							</span> -->
						<!-- </div> -->
					</div>
					<button
						@click="handleLogout"
						class="flex items-center gap-1.5 text-xs font-black uppercase tracking-[0.18em] text-gray-400 transition-colors hover:text-[#b42318]"
					>
						<svg
							class="h-3.5 w-3.5"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							stroke-width="2.5"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
							/>
						</svg>
						Sign Out
					</button>
				</div>
			</div>
		</div>

		<!-- Decorative accent line -->
		<div
			class="h-[3px] w-full bg-gradient-to-r from-[#b42318] via-[#f97316] to-transparent"
		></div>
	</header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, inject, watch } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const now = ref(new Date());
const auth = inject("$auth", null);
const currentUser = ref(auth?.user || auth?.cookie?.user_id || null);

const goToLogin = () => router.push("/login");
const goToSignup = () => router.push("/signup");
const goToCreatePost = () => router.push("/create-post");
const goToBackendPosts = () => {
	window.location.href = "http://localhost:8000/app/private/blog-post-";
};

const isAdministrator = computed(() => currentUser.value === "Administrator");

const handleLogout = async () => {
	await auth?.logout?.();
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

async function refreshCurrentUser() {
	if (!auth?.isLoggedIn) {
		currentUser.value = null;
		return;
	}

	try {
		const response = await fetch("/api/method/frappe.auth.get_logged_user");
		const data = await response.json();
		currentUser.value = data?.message || auth?.cookie?.user_id || null;
	} catch {
		currentUser.value = auth?.cookie?.user_id || null;
	}
}

let timer;
onMounted(() => {
	refreshCurrentUser();
	timer = setInterval(() => {
		now.value = new Date();
	}, 60000);
});
onUnmounted(() => clearInterval(timer));

watch(
	() => auth?.isLoggedIn,
	() => refreshCurrentUser(),
);
</script>
