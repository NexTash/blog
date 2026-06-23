<template>
	<main class="min-h-[calc(100vh-280px)] bg-[#f6f3ee] px-4 py-14">
		<div class="mx-auto w-full max-w-md">
			<div class="surface p-8 md:p-10">
				<!-- Form heading -->
				<div class="mb-8 border-b border-gray-100 pb-6 text-center">
					<h2 class="text-2xl font-black tracking-tight text-gray-900">
						Create your account
					</h2>
					<p class="kicker mt-2">Blogger Registration</p>
				</div>

				<!-- Success banner -->
				<div
					v-if="successMsg"
					class="mb-6 flex items-start gap-3 rounded-md border border-green-200 bg-green-50 px-4 py-3"
				>
					<svg
						class="mt-0.5 h-4 w-4 shrink-0 text-green-600"
						fill="currentColor"
						viewBox="0 0 20 20"
					>
						<path
							fill-rule="evenodd"
							d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
							clip-rule="evenodd"
						/>
					</svg>
					<p class="text-sm font-medium text-green-700">{{ successMsg }}</p>
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
				<form @submit.prevent="handleSignup" class="space-y-5">
					<div>
						<label for="full_name" class="form-label">Full Name</label>
						<input
							id="full_name"
							v-model="form.full_name"
							type="text"
							required
							autocomplete="name"
							placeholder="John Doe"
							class="form-input"
						/>
					</div>

					<div>
						<label for="email" class="form-label">Email Address</label>
						<input
							id="email"
							v-model="form.email"
							type="email"
							required
							autocomplete="email"
							placeholder="john@example.com"
							class="form-input"
						/>
					</div>

					<div>
						<label for="password" class="form-label">Password</label>
						<input
							id="password"
							v-model="form.password"
							type="password"
							required
							autocomplete="new-password"
							placeholder="••••••••"
							class="form-input"
						/>
					</div>

					<button
						type="submit"
						:disabled="loading"
						class="btn-primary w-full justify-center disabled:cursor-not-allowed disabled:bg-gray-400"
					>
						{{ loading ? "Creating Account…" : "Register Now" }}
					</button>
				</form>

				<!-- Footer link -->
				<div class="mt-8 border-t border-gray-100 pt-6 text-center">
					<p class="text-xs font-medium text-gray-500">
						Already have an account?
						<router-link to="/login" class="font-bold text-[#b42318] hover:underline"
							>Sign in</router-link
						>
					</p>
				</div>
			</div>
		</div>
	</main>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { blogApi } from "../api/blogServices";
import { getSignupErrorMessage } from "../utils/errors";

const router = useRouter();
const loading = ref(false);
const errorMsg = ref("");
const successMsg = ref("");

const form = reactive({ full_name: "", email: "", password: "" });

const handleSignup = async () => {
	errorMsg.value = "";
	successMsg.value = "";

	if (!isSignupFormValid()) return;

	loading.value = true;

	try {
		await blogApi.registerUser(form);
		successMsg.value = "Account created! Redirecting to login…";
		setTimeout(() => router.push("/login"), 1500);
	} catch (err) {
		errorMsg.value = getSignupErrorMessage(err);
	} finally {
		loading.value = false;
	}
};

function isSignupFormValid() {
	if (!form.full_name.trim()) {
		errorMsg.value = "Please enter your full name.";
		return false;
	}

	if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) {
		errorMsg.value = "Please enter a valid email address.";
		return false;
	}

	if (!form.password || form.password.length < 8) {
		errorMsg.value = "Password must be at least 8 characters.";
		return false;
	}

	return true;
}
</script>

<style scoped>
.form-label {
	@apply mb-2 block text-xs font-black uppercase tracking-[0.14em] text-gray-700;
}

.form-input {
	@apply w-full rounded-md border border-gray-300 px-4 py-3 text-sm outline-none transition-all placeholder:text-gray-300 focus:border-[#b42318] focus:ring-2 focus:ring-[#f5d8d4];
}
</style>
