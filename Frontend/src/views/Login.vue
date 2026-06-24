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

const email = ref("");
const password = ref("");
const loading = ref(false);
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
</script>

<style scoped>
.form-label {
	@apply mb-2 block text-xs font-black uppercase tracking-[0.14em] text-gray-700;
}

.form-input {
	@apply w-full rounded-md border border-gray-300 px-4 py-3 text-sm outline-none transition-all placeholder:text-gray-300 focus:border-[#b42318] focus:ring-2 focus:ring-[#f5d8d4];
}
</style>
