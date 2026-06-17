<template>
  <nav class="bg-[#c80000] text-white font-bold relative">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-14">

        <!-- Left Side: Nav Links -->
        <div class="flex items-center space-x-8">
          <!-- Mobile Menu Toggle -->
          <button @click="isMobileMenuOpen = !isMobileMenuOpen" class="md:hidden p-2">
            <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div class="hidden md:flex items-center space-x-8 text-sm tracking-wide">
            <a href="#" class="hover:opacity-80 transition-opacity">ABOUT</a>
            <div class="relative flex items-center space-x-1 cursor-pointer hover:opacity-80">
              <span>PARENT PAGE</span>
              <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>

        <!-- Right Side: Search Toggle Button -->
        <div class="flex items-center h-full">
          <button @click="isSearchOpen = !isSearchOpen" :class="isSearchOpen ? 'bg-[#910000]' : 'hover:bg-[#b00000]'"
            class="h-14 w-14 flex items-center justify-center transition-colors duration-200">
            <!-- Search Icon -->
            <svg v-if="!isSearchOpen" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" stroke-width="3">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <!-- Close Icon (X) -->
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" stroke-width="3">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Search Input Dropdown -->
    <transition name="slide-fade">
      <div v-if="isSearchOpen" class="absolute right-0 top-full z-50 w-full sm:w-[400px] sm:right-4 mt-2">
        <div class="bg-white p-4 shadow-2xl border border-gray-100 ring-1 ring-black ring-opacity-5">
          <div class="flex border border-gray-300 overflow-hidden">
            <input type="text" placeholder="Search"
              class="w-full px-4 py-2 text-gray-700 focus:outline-none font-normal" v-focus />
            <button class="bg-[#c80000] p-3 text-white hover:bg-[#a00000] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24"
                stroke="currentColor" stroke-width="3">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Mobile Menu Drawer (Simplified) -->
    <div v-if="isMobileMenuOpen" class="md:hidden bg-[#b00000] p-4">
      <a href="#" class="block py-2">ABOUT</a>
      <a href="#" class="block py-2 border-t border-red-400">PARENT PAGE</a>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue';

const isSearchOpen = ref(false);
const isMobileMenuOpen = ref(false);

// Directive to autofocus input when it appears
const vFocus = {
  mounted: (el) => el.focus()
}
</script>

<style scoped>
/* Smooth transition for the search bar appearing */
.slide-fade-enter-active {
  transition: all 0.2s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.1s ease-in;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}
</style>