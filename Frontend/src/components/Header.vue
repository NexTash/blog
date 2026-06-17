<template>
    <header class="w-full shadow-sm">
        <!-- Top Bar (Always Visible) -->
        <div class="bg-[#333333] border-t-4 border-[#1e4d2b] py-2 px-4 md:px-8">
            <div class="max-w-7xl mx-auto">
                <span class="text-[#aaaaaa] text-xs md:text-sm font-medium uppercase tracking-wide">
                    {{ formattedDate }}
                </span>
            </div>
        </div>

        <!-- Main Branding Area (Always Visible) -->
        <div class="bg-white py-8 px-4 md:px-8">
            <div class="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">

                <!-- Left Side: Branding (Always Visible) -->
                <div class="max-w-2xl">
                    <h1 class="text-3xl md:text-5xl font-extrabold text-[#333] tracking-tight">
                        NextNews
                    </h1>
                    <p class="mt-2 text-[#555555] text-base md:text-lg leading-snug">
                        NewsCard is a Multi-Purpose Magazine/News WordPress Theme.
                    </p>
                </div>

                <!-- Right Side: Conditional Action Area -->
                <div class="flex-shrink-0">

                    <!-- 1. SHOW ONLY IF GUEST (NOT LOGGED IN) -->
                    <button v-if="!auth.isLoggedIn" @click="goToLogin"
                        class="bg-[#c80000] hover:bg-[#a00000] text-white px-6 py-3 rounded-sm font-bold uppercase tracking-widest text-sm transition-all shadow-md">
                        Login as Blogger
                    </button>

                    <!-- 2. SHOW ONLY IF USER IS LOGGED IN -->
                    <div v-else class="flex flex-col items-end">
                        <div class="flex items-center gap-3 mb-2">
                            <!-- NEW: Create Post Button -->
                            <button @click="goToCreatePost"
                                class="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded-sm font-bold uppercase tracking-widest text-[10px] transition-all shadow-sm">
                                + Create Post
                            </button>

                            <span class="text-xs font-black text-gray-800 uppercase tracking-widest">
                                {{ auth.user }}
                            </span>
                        </div>

                        <button @click="handleLogout"
                            class="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c80000] hover:text-gray-400 transition-colors">
                            Logout Account →
                        </button>
                    </div>

                </div>

            </div>
        </div>
    </header>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, inject } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const now = ref(new Date());

// 1. Inject the Auth service to track login status
const auth = inject('$auth');

// 2. Navigation Functions
const goToLogin = () => {
    router.push('/login');
};

const goToCreatePost = () => {
    router.push('/create-post');
};

const handleLogout = async () => {
    await auth.logout();
    router.push('/'); // Send them home after logging out
};

// --- Clock Logic (Unchanged) ---
const formattedDate = computed(() => {
    const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
    return now.value.toLocaleDateString('en-US', options);
});

let timer;
onMounted(() => {
    timer = setInterval(() => { now.value = new Date(); }, 60000);
});
onUnmounted(() => { clearInterval(timer); });
</script>

<style scoped>
button {
    cursor: pointer;
}
</style>