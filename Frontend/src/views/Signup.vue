<template>
    <div class="min-h-screen bg-[#f9f9f9] flex items-center justify-center px-4 py-12">
        <div class="max-w-md w-full bg-white p-8 border border-gray-200 shadow-sm rounded-sm">

            <div class="text-center mb-10">
                <h1 class="text-3xl font-extrabold text-[#333] tracking-tight">Join NextNews</h1>
                <p class="text-[11px] text-gray-500 mt-2 font-bold uppercase tracking-[0.2em]">Create Blogger Account
                </p>
            </div>

            <form @submit.prevent="handleSignup" class="space-y-5">
                <div>
                    <label class="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2">Full
                        Name</label>
                    <input v-model="form.full_name" type="text" required class="form-input" placeholder="John Doe" />
                </div>

                <div>
                    <label class="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2">Email
                        Address</label>
                    <input v-model="form.email" type="email" required class="form-input"
                        placeholder="john@example.com" />
                </div>

                <div>
                    <label
                        class="block text-xs font-black text-gray-700 uppercase tracking-widest mb-2">Password</label>
                    <input v-model="form.password" type="password" required class="form-input" placeholder="••••••••" />
                </div>

                <button type="submit" :disabled="loading"
                    class="w-full bg-[#c80000] hover:bg-[#a00000] text-white font-bold py-3 uppercase tracking-widest text-xs transition-all shadow-md disabled:bg-gray-400">
                    {{ loading ? 'Creating Account...' : 'Register Now' }}
                </button>
            </form>

            <div class="mt-8 pt-6 border-t border-gray-100 text-center">
                <p class="text-xs text-gray-500 font-medium">
                    Already have an account?
                    <router-link to="/login" class="text-[#c80000] font-bold hover:underline">Login here</router-link>
                </p>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const loading = ref(false);
const form = reactive({
    full_name: '',
    email: '',
    password: ''
});

const handleSignup = async () => {
    loading.value = true;
    try {
        const response = await fetch('/api/method/blog.api.register_user', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        });

        const data = await response.json();

        if (data.message) {
            alert("Registration successful! Please login.");
            router.push('/login');
        } else {
            throw new Error(data.exception || "Registration failed");
        }
    } catch (error) {
        alert(error.message);
    } finally {
        loading.value = false;
    }
};
</script>

<style scoped>
.form-input {
    @apply w-full px-4 py-3 border border-gray-300 rounded-sm focus:ring-1 focus:ring-[#c80000] focus:border-[#c80000] outline-none transition-all text-sm;
}
</style>