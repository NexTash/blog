<template>
	<div class="border-b border-gray-200 bg-[#f6f3ee] px-4 py-3">
		<div
			class="surface mx-auto flex max-w-7xl flex-col overflow-hidden min-[575px]:h-12 min-[575px]:flex-row">

			<!-- Left Label -->
			<div
				class="relative z-10 flex h-10 shrink-0 items-center justify-center border-b border-gray-200 bg-gray-900 px-5 text-white min-[575px]:h-full min-[575px]:justify-start min-[575px]:border-b-0 min-[575px]:border-r min-[575px]:border-gray-800 min-[575px]:pr-12 min-[575px]:[clip-path:polygon(0_0,93%_0,100%_100%,0%_100%)]">
				<div class="mr-3 flex items-center justify-center">
					<div class="live-dot"></div>
				</div>

				<span class="whitespace-nowrap text-sm font-black uppercase tracking-tight">
					Just In
				</span>
			</div>

			<!-- Marquee -->
			<div class="flex h-[50px] flex-1 items-center overflow-hidden bg-white min-[575px]:h-full">

				<div v-if="blogs.data && blogs.data.length > 0" ref="marquee"
					class="animate-marquee flex whitespace-nowrap hover:[animation-play-state:paused]"
					:style="{ animationDuration: duration + 's' }">

					<!-- First copy -->
					<ul class="m-0 flex list-none items-center p-0">
						<li v-for="item in blogs.data" :key="'a-' + item.name" class="px-6 min-[575px]:px-8">
							<router-link :to="{ name: 'PostDetail', params: { name: item.name } }"
								class="text-sm font-bold text-gray-700 transition-colors hover:text-[#b42318] hover:underline min-[575px]:text-[15px]">
								{{ item.title }}
							</router-link>
						</li>
					</ul>

					<!-- Duplicate -->
					<ul class="m-0 flex list-none items-center p-0" aria-hidden="true">
						<li v-for="item in blogs.data" :key="'b-' + item.name" class="px-6 min-[575px]:px-8">
							<router-link :to="{ name: 'PostDetail', params: { name: item.name } }"
								class="text-sm font-bold text-gray-700 transition-colors hover:text-[#b42318] hover:underline min-[575px]:text-[15px]">
								{{ item.title }}
							</router-link>
						</li>
					</ul>

				</div>

				<div v-else class="px-6 text-sm font-medium italic text-gray-400">
					Fetching latest updates...
				</div>

			</div>

		</div>
	</div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from "vue";
import { blogsResource } from "../api/blogServices.js";

const blogs = blogsResource;

const marquee = ref(null);
const duration = ref(40);

// Pixels per second
const SPEED = 80;

function updateDuration() {
	if (!marquee.value) return;

	// Divide by 2 because we duplicated the list
	const width = marquee.value.scrollWidth / 2;

	duration.value = width / SPEED;
}

onMounted(async () => {
	if (blogs.data.length === 0) {
		await blogs.fetch();
	}

	await nextTick();
	updateDuration();
});

watch(
	() => blogs.data,
	async () => {
		await nextTick();
		updateDuration();
	},
	{ deep: true }
);
</script>

<style scoped>
@keyframes marquee {
	from {
		transform: translateX(0);
	}

	to {
		transform: translateX(-50%);
	}
}

.animate-marquee {
	display: flex;
	width: max-content;
	animation-name: marquee;
	animation-timing-function: linear;
	animation-iteration-count: infinite;
}

.live-dot {
	position: relative;
	z-index: 20;
	height: 10px;
	width: 10px;
	border-radius: 9999px;
	background-color: #f97316;
}

.live-dot::after {
	content: "";
	position: absolute;
	left: 50%;
	top: 50%;
	height: 10px;
	width: 10px;
	margin-left: -5px;
	margin-top: -5px;
	border-radius: 9999px;
	border: 1px solid #f97316;
	animation: blink-b 2s infinite;
}

@keyframes blink-b {
	0% {
		transform: scale(1);
	}

	100% {
		transform: scale(3);
		opacity: 0;
	}
}
</style>