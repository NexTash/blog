<template>
    <main class="min-h-screen bg-[#f9f9f9] py-12">
        <div class="max-w-3xl mx-auto px-6">

            <!-- Card Container -->
            <div class="bg-white border border-gray-200 p-8 shadow-sm rounded-sm">
                <header class="mb-8 border-b border-gray-100 pb-6">
                    <h1 class="text-3xl font-extrabold text-[#333] tracking-tight">Create New Story</h1>
                    <p class="text-gray-500 text-sm mt-1 uppercase tracking-widest font-bold">Blogger Dashboard</p>
                </header>

                <form @submit.prevent="handleSubmit" class="space-y-6">

                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <!-- Title -->
                        <div class="md:col-span-2">
                            <label class="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2">Article
                                Title</label>
                            <input v-model="form.title" type="text" required placeholder="Enter a catchy title..."
                                class="form-input font-bold text-lg" />
                        </div>

                        <!-- Category Dropdown -->
                        <div class="md:col-span-2">
                            <label
                                class="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2">Category</label>
                            <select v-model="form.category" required
                                class="form-input appearance-none bg-white cursor-pointer">
                                <option value="" disabled>Select a category</option>
                                <option v-for="cat in categories" :key="cat.name" :value="cat.name">
                                    {{ cat.title || cat.name }}
                                </option>
                            </select>
                        </div>
                    </div>

                    <!-- Intro -->
                    <div>
                        <label class="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2">Short Intro
                            (Summary)</label>
                        <textarea v-model="form.blog_intro" rows="2" required
                            placeholder="A brief summary of the story..." class="form-input text-sm"></textarea>
                    </div>

                    <!-- Content -->
                    <div>
                        <label class="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2">Article
                            Body (HTML allowed)</label>
                        <textarea v-model="form.content" rows="10" required placeholder="Write your story here..."
                            class="form-input text-base leading-relaxed"></textarea>
                    </div>

                    <!-- Buttons -->
                    <div class="flex items-center justify-between pt-4">
                        <button type="button" @click="$router.back()"
                            class="text-sm font-bold text-gray-400 hover:text-gray-600 uppercase tracking-widest">
                            Cancel
                        </button>
                        <button type="submit" :disabled="loading"
                            class="bg-[#c80000] hover:bg-[#a00000] text-white px-8 py-3 rounded-sm font-bold uppercase tracking-widest text-sm transition-all shadow-md disabled:bg-gray-400">
                            {{ loading ? 'Publishing...' : 'Publish Story' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </main>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const loading = ref(false);
const categories = ref([]);

const form = reactive({
    title: '',
    blog_intro: '',
    content: '',
    category: ''
});

// Helper to get Frappe CSRF token from cookies (Standard Frappe Security)
const getCsrfToken = () => {
    const cookie = document.cookie.split('; ').find(row => row.startsWith('sid='));
    // If you are using frappe-ui or standard frappe, the token is often on the window object
    return window.frappe ? window.frappe.csrf_token : '';
};

// Fetch Categories from Backend
const fetchCategories = async () => {
    try {
        const response = await fetch('/api/method/blog.api.blog_categories');
        const data = await response.json();
        if (data.message) {
            categories.value = data.message;
            // Set default category if available
            if (categories.value.length > 0) {
                form.category = categories.value[0].name;
            }
        }
    } catch (error) {
        console.error("Failed to load categories:", error);
    }
};

onMounted(() => {
    fetchCategories();
});

const handleSubmit = async () => {
    if (!form.title || !form.content) {
        alert("Please fill in the title and content.");
        return;
    }

    loading.value = true;
    try {
        const response = await fetch('/api/method/blog.api.create_blog_post', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // 'X-Frappe-CSRF-Token': getCsrfToken() 
            },
            body: JSON.stringify(form)
        });

        const data = await response.json();

        if (response.ok && data.message) {
            alert("Post Published Successfully!");
            router.push('/');
        } else {
            // Handle Frappe validation errors
            const errorMsg = data._server_messages
                ? JSON.parse(JSON.parse(data._server_messages)[0]).message
                : (data.exception || "Failed to publish");
            throw new Error(errorMsg);
        }
    } catch (error) {
        console.error("Submit Error:", error);
        alert(error.message);
    } finally {
        loading.value = false;
    }
};
</script>

<style scoped>
.form-input {
    @apply w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-1 focus:ring-[#c80000] focus:border-[#c80000] outline-none transition-all;
}
</style>