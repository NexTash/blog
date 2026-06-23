<template>
	<main class="min-h-[calc(100vh-280px)] bg-[#f6f3ee] px-4 py-14">
		<div class="mx-auto w-full max-w-md">
			<div class="surface p-8 md:p-10">
				<div class="mb-8 border-b border-gray-100 pb-6 text-center">
					<h2 class="text-2xl font-black tracking-tight text-gray-900">
						Create new password
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

				<form v-if="!successMsg" @submit.prevent="resetPassword" class="space-y-5">
					<div>
						<label for="new_password" class="form-label">New Password</label>
						<input
							id="new_password"
							v-model="password"
							type="password"
							required
							autocomplete="new-password"
							placeholder="••••••••"
							class="form-input"
						/>
					</div>

					<div>
						<label for="confirm_password" class="form-label">Confirm Password</label>
						<input
							id="confirm_password"
							v-model="confirmPassword"
							type="password"
							required
							autocomplete="new-password"
							placeholder="••••••••"
							class="form-input"
						/>
					</div>

					<button
						type="submit"
						:disabled="loading || !resetKey"
						class="btn-primary w-full justify-center disabled:cursor-not-allowed disabled:bg-gray-400"
					>
						{{ loading ? "Updating…" : "Update Password" }}
					</button>
				</form>

				<div class="mt-8 border-t border-gray-100 pt-6 text-center">
					<router-link
						:to="successMsg ? '/' : '/forgot-password'"
						class="text-xs font-black uppercase tracking-[0.14em] text-[#b42318] hover:underline"
					>
						{{ successMsg ? "Continue to website" : "Request a new link" }}
					</router-link>
				</div>
			</div>
		</div>
	</main>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRoute } from "vue-router";
import { blogApi } from "../api/blogServices";
import { getForgotPasswordErrorMessage } from "../utils/errors";

const route = useRoute();
const resetKey = computed(() => String(route.query.key || ""));
const password = ref("");
const confirmPassword = ref("");
const loading = ref(false);
const errorMsg = ref(resetKey.value ? "" : "This reset link is invalid or has expired.");
const successMsg = ref("");

async function resetPassword() {
	errorMsg.value = "";
	successMsg.value = "";

	if (!resetKey.value) {
		errorMsg.value = "This reset link is invalid or has expired.";
		return;
	}

	if (password.value.length < 8) {
		errorMsg.value = "Please choose a password with at least 8 characters.";
		return;
	}

	if (password.value !== confirmPassword.value) {
		errorMsg.value = "Passwords do not match.";
		return;
	}

	loading.value = true;

	try {
		await blogApi.resetPassword({
			key: resetKey.value,
			new_password: password.value,
		});
		successMsg.value = "Password updated successfully. You can continue on the website.";
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
