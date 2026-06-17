<template>
  <div
    class="relative flex flex-col min-[575px]:flex-row w-full h-auto min-[575px]:h-12 bg-white min-[575px]:bg-[#f2f2f2] border-y border-gray-300 overflow-hidden font-sans">

    <!-- "Top Stories" Label -->
    <div
      class="relative z-10 flex items-center justify-center min-[575px]:justify-start w-full min-[575px]:w-auto h-10 min-[575px]:h-full bg-[#e3e3e3] px-4 min-[575px]:pl-6 min-[575px]:pr-14 shrink-0 min-[575px]:[clip-path:polygon(0_0,93%_0,100%_100%,0%_100%)] border-b min-[575px]:border-b-0 min-[575px]:border-r border-gray-300 min-[575px]:border-gray-400">

      <div class="mr-3 flex items-center justify-center">
        <div class="live-dot"></div>
      </div>

      <span class="text-sm min-[575px]:text-base font-extrabold text-[#333] whitespace-nowrap uppercase tracking-tight">
        Top Stories
      </span>
    </div>

    <!-- Scrolling Ticker Container -->
    <div
      class="w-full overflow-hidden h-[50px] min-[575px]:flex-1 min-[575px]:h-full flex items-center bg-white min-[575px]:bg-transparent">

      <!-- Only show ticker if there is data -->
      <div v-if="blogs.data && blogs.data.length > 0"
        class="flex whitespace-nowrap animate-marquee hover:[animation-play-state:paused]">

        <!-- Primary List (Dynamic) -->
        <ul class="flex items-center list-none m-0 p-0">
          <li v-for="(item, index) in blogs.data" :key="'a-' + index" class="px-6 min-[575px]:px-8">
            <router-link :to="`/post/${item.name}`"
              class="text-sm min-[575px]:text-[15px] font-bold text-[#333333] hover:text-[#c80000] transition-colors hover:underline">
              {{ item.title }}
            </router-link>
          </li>
        </ul>

        <!-- Duplicate List for Seamless Loop (Dynamic) -->
        <ul class="flex items-center list-none m-0 p-0" aria-hidden="true">
          <li v-for="(item, index) in blogs.data" :key="'b-' + index" class="px-6 min-[575px]:px-8">
            <router-link :to="`/blog/${item.name}`"
              class="text-sm min-[575px]:text-[15px] font-bold text-[#333333] hover:text-[#c80000] transition-colors hover:underline">
              {{ item.title }}
            </router-link>
          </li>
        </ul>
      </div>

      <!-- Loading Placeholder -->
      <div v-else class="px-6 text-sm text-gray-400 italic">
        Fetching latest updates...
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { blogsResource } from '../api/blogServices.js';

// Access the shared global store
const blogs = blogsResource;

// Ensure data is fetched if this component is loaded directly
onMounted(() => {
  if (blogs.data.length === 0) {
    blogs.fetch();
  }
});
</script>

<style scoped>
@keyframes marquee {
  0% {
    transform: translateX(0);
  }

  100% {
    transform: translateX(-50%);
  }
}

.animate-marquee {
  display: flex;
  width: max-content;
  animation: marquee 40s linear infinite;
  /* Adjusted speed for longer titles */
}

/* Live Dot Styling */
.live-dot {
  position: relative;
  width: 10px;
  height: 10px;
  background-color: #c80000;
  border-radius: 50%;
  z-index: 20;
}

.live-dot::after {
  content: "";
  position: absolute;
  height: 10px;
  width: 10px;
  border-radius: 50%;
  border: 1px solid #c80000;
  top: 50%;
  margin-top: -5px;
  left: 50%;
  margin-left: -5px;
  animation: blink-b 2s infinite;
}

@keyframes blink-b {
  0% {
    transform: scale(1, 1);
  }

  100% {
    transform: scale(3, 3);
    opacity: 0;
  }
}
</style>