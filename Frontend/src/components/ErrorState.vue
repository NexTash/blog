<template>
	<div class="bg-[#f6f3ee] px-4 py-12">
		<div
			class="surface mx-auto flex max-w-3xl flex-col items-center justify-center px-6 py-16 text-center"
		>
			<div
				class="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#fff4f1] text-[#b42318]"
			>
				<svg class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
					/>
				</svg>
			</div>
			<p class="kicker">Connection Issue</p>
			<h2 class="mt-2 text-2xl font-black tracking-tight text-gray-900">
				{{ title }}
			</h2>
			<p class="mt-3 max-w-xl text-sm leading-6 text-gray-500">
				{{ message }}
			</p>
			<button v-if="showRetry" class="btn-primary mt-7" type="button" @click="$emit('retry')">
				Try Again
			</button>
		</div>
	</div>
</template>

<script setup>
defineProps({
	title: {
		type: String,
		default: "Could not load blogs",
	},
	message: {
		type: String,
		default: "This is taking longer than expected. Please check your connection and try again.",
	},
	showRetry: {
		type: Boolean,
		default: true,
	},
});

defineEmits(["retry"]);
</script>
