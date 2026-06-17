<template>
	<div class="min-h-screen bg-[#f9f9f9] flex items-center justify-center px-4">
		<!-- Login Card -->
		<div class="max-w-md w-full bg-white border border-gray-200 p-8 shadow-sm rounded-sm">

			<!-- Branding Header -->
			<div class="text-center mb-10">
				<h1 class="text-3xl font-extrabold text-[#333] tracking-tight">NextNews</h1>
				<p class="text-[11px] text-gray-500 mt-2 font-bold uppercase tracking-[0.2em]">Blogger Portal</p>
			</div>

			<!-- Form -->
			<form @submit.prevent="login" class="space-y-6">

				<!-- Username Field -->
				<div>
					<label for="email" class="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2">
						Username
					</label>
					<input type="text" v-model="email" placeholder="Enter username"
						class="w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-1 focus:ring-[#c80000] focus:border-[#c80000] outline-none transition-all placeholder:text-gray-300 text-sm" />
				</div>

				<!-- Password Field -->
				<div>
					<label for="password" class="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2">
						Password
					</label>
					<input type="password" v-model="password" placeholder="••••••••"
						class="w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-1 focus:ring-[#c80000] focus:border-[#c80000] outline-none transition-all placeholder:text-gray-300 text-sm" />
				</div>

				<!-- Sign In Button -->
				<button type="submit"
					class="w-full bg-[#c80000] hover:bg-[#a00000] text-white font-bold py-3 uppercase tracking-widest text-xs transition-colors shadow-md active:scale-[0.98]">
					Sign in
				</button>

				<p class="text-center text-[14px] text-gray-500">
					Don't have an account? <router-link to="/signup" class="text-[#c80000] hover:text-[#a00000]">Sign
						up</router-link>
				</p>
			</form>

			<!-- Decorative Footer -->
			<div class="mt-8 pt-6 border-t border-gray-100 text-center">
				<router-link to="/"
					class="text-[10px] font-bold text-gray-400 hover:text-[#c80000] uppercase tracking-widest transition-colors">
					← Back to Homepage
				</router-link>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			email: null,
			password: null,
		};
	},
	inject: ["$auth"],
	async mounted() {
		if (this.$route?.query?.route) {
			this.redirect_route = this.$route.query.route;
			this.$router.replace({ query: null });
		}
	},
	methods: {
		async login() {
			if (this.email && this.password) {
				let res = await this.$auth.login(this.email, this.password);
				if (res) {
					// Navigates to Frontend as requested
					this.$router.push({ name: "Home" });
				}
			}
		},

	},
};
</script>

<style scoped>
/* Ensuring the font feels like a modern news site */
input {
	font-family: sans-serif;
}
</style>