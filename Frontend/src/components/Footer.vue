<template>
    <footer class="bg-[#333333] py-8 px-4 border-t border-white/5">
        <div class="max-w-7xl mx-auto text-center md:text-left">
            <p class="text-[#999999] text-sm font-medium leading-relaxed">
                Copyright © {{ new Date().getFullYear() }}
                <a href="#" class="brand-link text-[#cccccc]">NextNews</a>
                <span class="mx-2 hidden md:inline text-gray-600">|</span>

                <!-- Break line on mobile for better readability -->
                <span class="block md:inline mt-1 md:mt-0">
                    Theme by:
                    <a href="#" class="brand-link text-[#cccccc]">Usman</a>
                    <span class="mx-2 hidden md:inline text-gray-600">|</span>
                </span>
                <span class="block md:inline mt-1 md:mt-0">
                    Proudly Powered by:
                    <!-- Replaced inline hover classes with a custom class -->
                    <a href="#" class="brand-link text-[#cccccc] ">NexTash</a>
                </span>
            </p>
        </div>
    </footer>
</template>

<script setup>
// No complex logic needed for this component
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@normal;500;700&display=swap');

footer {
    font-family: 'Roboto', sans-serif;
}

/* Defining the hover state once */
.brand-link:hover {
    color: #949494;
    text-decoration: underline;
}
</style>