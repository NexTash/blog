<template>
	<main class="min-h-[calc(100vh-280px)] bg-[#f6f3ee] px-4 py-14">
		<div class="mx-auto w-full max-w-md">
			<div class="surface p-8 md:p-10">
				<!-- Form heading -->
				<div class="mb-8 border-b border-gray-100 pb-6 text-center">
					<h2 class="text-2xl font-black tracking-tight text-gray-900">Welcome back</h2>
					<p class="kicker mt-2">Blogger Portal</p>
				</div>

				<!-- Error banner -->
				<div
					v-if="errorMsg"
					class="mb-6 flex items-start gap-3 rounded-md border border-red-200 bg-red-50 px-4 py-3"
				>
					<svg
						class="mt-0.5 h-4 w-4 shrink-0 text-red-500"
						fill="currentColor"
						viewBox="0 0 20 20"
					>
						<path
							fill-rule="evenodd"
							d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
							clip-rule="evenodd"
						/>
					</svg>
					<p class="text-sm font-medium text-red-700">{{ errorMsg }}</p>
				</div>

				<!-- Form -->
				<form @submit.prevent="login" class="space-y-5">
					<div>
						<label for="username" class="form-label">Username</label>
						<input
							id="username"
							v-model="email"
							type="text"
							required
							autocomplete="username"
							placeholder="Enter username"
							class="form-input"
						/>
					</div>

					<div>
						<div class="mb-2 flex items-center justify-between gap-3">
							<label for="password" class="form-label mb-0">Password</label>
							<router-link
								to="/forgot-password"
								class="text-xs font-bold text-[#b42318] hover:underline"
							>
								Forgot password?
							</router-link>
						</div>
						<input
							id="password"
							v-model="password"
							type="password"
							required
							autocomplete="current-password"
							placeholder="••••••••"
							class="form-input"
						/>
					</div>

					<button
						type="submit"
						:disabled="loading"
						class="btn-primary w-full justify-center disabled:cursor-not-allowed disabled:bg-gray-400"
					>
						{{ loading ? "Signing in…" : "Sign In" }}
					</button>
				</form>

				<div class="my-6 flex items-center gap-3">
					<div class="h-px flex-1 bg-gray-200"></div>
					<span class="text-xs font-black uppercase tracking-[0.14em] text-gray-400">or</span>
					<div class="h-px flex-1 bg-gray-200"></div>
				</div>

				<button
					type="button"
					:disabled="googleLoading"
					class="google-login-button"
					@click="loginWithGoogle"
				>
					<svg class="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
						<path
							fill="#4285F4"
							d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
						/>
						<path
							fill="#34A853"
							d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
						/>
						<path
							fill="#FBBC05"
							d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z"
						/>
						<path
							fill="#EA4335"
							d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06L5.84 9.9C6.71 7.31 9.14 5.38 12 5.38z"
						/>
					</svg>
					<span>{{ googleLoading ? "Opening Google…" : "Continue with Google" }}</span>
				</button>

				<!-- Footer link -->
				<div class="mt-8 border-t border-gray-100 pt-6 text-center">
					<p class="text-xs font-medium text-gray-500">
						Don't have an account?
						<router-link to="/signup" class="font-bold text-[#b42318] hover:underline"
							>Create one</router-link
						>
					</p>
				</div>
			</div>
		</div>
	</main>
</template>

<script setup>
import { ref, inject } from "vue";
import { useRouter, useRoute } from "vue-router";
import { getLoginErrorMessage } from "../utils/errors";
import { trackCurrentSession } from "../utils/traffic";

const router = useRouter();
const route = useRoute();
const auth = inject("$auth");
const call = inject("$call");

const email = ref("");
const password = ref("");
const loading = ref(false);
const googleLoading = ref(false);
const errorMsg = ref("");

const login = async () => {
	if (!email.value || !password.value) {
		errorMsg.value = "Please enter your username and password.";
		return;
	}

	errorMsg.value = "";
	loading.value = true;

	try {
		const res = await auth.login(email.value, password.value);
		if (res) {
			const redirect = route.query.route || "/";
			await router.push(redirect);
			await trackCurrentSession(router.currentRoute.value);
		} else {
			errorMsg.value = "Invalid credentials. Please try again.";
		}
	} catch (err) {
		errorMsg.value = getLoginErrorMessage(err);
	} finally {
		loading.value = false;
	}
};

const loginWithGoogle = async () => {
	errorMsg.value = "";
	googleLoading.value = true;

	try {
		const authUrl = await call("blog.api.get_google_login_url", {
			redirect_to: getRedirectUrl(),
		});
		window.location.href = authUrl;
	} catch (err) {
		errorMsg.value = getLoginErrorMessage(err);
		googleLoading.value = false;
	}
};

const getRedirectUrl = () => {
	const requestedRoute = Array.isArray(route.query.route)
		? route.query.route[0]
		: route.query.route;
	const redirectPath =
		typeof requestedRoute === "string" && requestedRoute.startsWith("/") && !requestedRoute.startsWith("//")
			? requestedRoute
			: "/";

	return router.resolve(redirectPath).href;
};
</script>

<style scoped>
.form-label {
	@apply mb-2 block text-xs font-black uppercase tracking-[0.14em] text-gray-700;
}

.form-input {
	@apply w-full rounded-md border border-gray-300 px-4 py-3 text-sm outline-none transition-all placeholder:text-gray-300 focus:border-[#b42318] focus:ring-2 focus:ring-[#f5d8d4];
}

.google-login-button {
	@apply flex w-full items-center justify-center gap-3 rounded-md border border-gray-300 bg-white px-4 py-3 text-sm font-black text-gray-700 transition-all hover:border-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#f5d8d4] disabled:cursor-not-allowed disabled:opacity-60;
}
</style>
