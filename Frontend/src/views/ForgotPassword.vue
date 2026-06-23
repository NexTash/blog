<template>
	<main class="min-h-[calc(100vh-280px)] bg-[#f6f3ee] px-4 py-14">
		<div class="mx-auto w-full max-w-md">
			<div class="surface p-8 md:p-10">
				<div class="mb-8 border-b border-gray-100 pb-6 text-center">
					<h2 class="text-2xl font-black tracking-tight text-gray-900">
						Reset your password
					</h2>
					<p class="kicker mt-2">Account Recovery</p>
				</div>

				<div
					v-if="successMsg"
					class="mb-6 rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700"
				>
					{{ successMsg }}
				</div>

				<div
					v-if="errorMsg"
					class="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
				>
					{{ errorMsg }}
				</div>

				<form v-if="!successMsg" @submit.prevent="requestReset" class="space-y-5">
					<div>
						<label for="reset_email" class="form-label">Email Address</label>
						<input
							id="reset_email"
							v-model="email"
							type="email"
							required
							autocomplete="email"
							placeholder="you@example.com"
							class="form-input"
						/>
					</div>

					<button
						type="submit"
						:disabled="loading"
						class="btn-primary w-full justify-center disabled:cursor-not-allowed disabled:bg-gray-400"
					>
						{{ loading ? "Sending…" : "Send Reset Link" }}
					</button>
				</form>

				<div class="mt-8 border-t border-gray-100 pt-6 text-center">
					<router-link
						to="/login"
						class="text-xs font-black uppercase tracking-[0.14em] text-[#b42318] hover:underline"
					>
						Back to sign in
					</router-link>
				</div>
			</div>
		</div>
	</main>
</template>

<script setup>
import { ref } from "vue";
import { blogApi } from "../api/blogServices";
import { getForgotPasswordErrorMessage } from "../utils/errors";

const email = ref("");
const loading = ref(false);
const errorMsg = ref("");
const successMsg = ref("");

async function requestReset() {
	errorMsg.value = "";
	successMsg.value = "";

	if (!email.value.trim() || !/^\S+@\S+\.\S+$/.test(email.value)) {
		errorMsg.value = "Please enter a valid email address.";
		return;
	}

	loading.value = true;

	try {
		await blogApi.requestPasswordReset(email.value.trim());
		successMsg.value =
			"If this email is registered, password reset instructions have been sent. Please check your inbox.";
	} catch (error) {
		errorMsg.value = getForgotPasswordErrorMessage(error);
	} finally {
		loading.value = false;
	}
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
