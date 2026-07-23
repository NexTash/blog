<template>
    <main
        class="min-h-screen bg-[#f3f2ef] text-[#1a1a1a] selection:bg-[#f5d8d4] selection:text-[#b42318] px-4 py-8 md:py-12">
        <div class="mx-auto max-w-7xl">

            <!-- SUCCESS MESSAGE VIEW -->
            <div v-if="isSubmitted" class="fade-in flex flex-col items-center justify-center min-h-[70vh]">
                <div class="max-w-xl w-full bg-white rounded-3xl p-12 border border-gray-200 shadow-2xl text-center">
                    <div
                        class="mb-8 inline-flex h-24 w-24 items-center justify-center rounded-full bg-green-50 text-green-600 border border-green-100">
                        <svg class="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                                d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 class="text-3xl md:text-4xl font-serif font-bold text-black mb-4">{{ successTitle }}</h2>
                    <p class="text-base text-gray-600 mb-10 leading-relaxed">{{ submissionMessage }}</p>
                    <div class="space-y-4">
                        <router-link to="/"
                            class="block w-full rounded-xl bg-black py-4 text-xs font-bold uppercase tracking-widest text-white transition-all hover:bg-gray-800 shadow-lg focus:ring-4 focus:ring-gray-300">
                            Return to Dashboard
                        </router-link>
                        <button @click="startFreshStory"
                            class="text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-black transition-colors">
                            Draft Another Story
                        </button>
                    </div>
                </div>
            </div>

            <!-- EDITOR VIEW -->
            <div v-else>
                <header
                    class="mb-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between border-b border-gray-300 pb-6">
                    <div>
                        <nav
                            class="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-3">
                            <span>Blogger Workspace</span>
                            <span>/</span>
                            <span class="text-black">{{ isEditing ? "Edit Story" : "New Story" }}</span>
                        </nav>
                        <div class="flex items-center gap-4">
                            <h1 class="text-3xl md:text-4xl font-serif font-bold tracking-tight text-black">
                                {{ headerTitle }}
                            </h1>
                            <span v-if="isSystemManager"
                                class="px-3 py-1 bg-blue-100 text-blue-800 text-[10px] font-bold uppercase tracking-widest rounded-full">
                                Manager Mode
                            </span>
                        </div>
                    </div>

                    <div class="inline-flex rounded-full bg-gray-200/80 p-1 shadow-inner ring-1 ring-gray-300">
                        <button type="button" @click="activeTab = 'write'"
                            :class="activeTab === 'write' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-black'"
                            class="rounded-full px-6 py-2 text-xs font-bold uppercase tracking-wider transition-all">
                            ✏️ Write
                        </button>
                        <button type="button" @click="activeTab = 'preview'"
                            :class="activeTab === 'preview' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-black'"
                            class="rounded-full px-6 py-2 text-xs font-bold uppercase tracking-wider transition-all">
                            👁️ Preview
                        </button>
                    </div>
                </header>

                <div v-show="activeTab === 'write'" class="fade-in">
                    <form @submit.prevent="handleSubmit" class="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">

                        <!-- MAIN CONTENT AREA -->
                        <div class="space-y-6">
                            <div v-if="isLoadingCurrentPost"
                                class="bg-white rounded-2xl p-20 text-center border border-gray-200 flex flex-col items-center justify-center space-y-4">
                                <div class="w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin">
                                </div>
                                <p class="text-sm font-bold uppercase tracking-widest text-gray-500">Loading Content...
                                </p>
                            </div>

                            <template v-else>
                                <!-- Image Upload -->
                                <div class="group relative h-72 w-full overflow-hidden rounded-2xl bg-white border-2 border-dashed transition-all focus-within:ring-4 focus-within:ring-gray-200"
                                    :class="isDragOver ? 'border-black bg-gray-50' : 'border-gray-300 hover:border-gray-500'"
                                    @dragover.prevent="isDragOver = true" @dragleave.prevent="isDragOver = false"
                                    @drop.prevent="handleImageDrop">

                                    <div v-if="imagePreview" class="h-full w-full">
                                        <img :src="imagePreview" alt="Story Cover" class="h-full w-full object-cover" />
                                        <div
                                            class="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button type="button" @click.stop="clearImage"
                                                class="rounded-full bg-white px-6 py-2 text-xs font-bold uppercase text-black hover:bg-red-600 hover:text-white transition-colors">
                                                Remove Cover
                                            </button>
                                        </div>
                                    </div>

                                    <button v-else @click="openImagePicker" type="button"
                                        class="flex h-full w-full flex-col items-center justify-center gap-4 hover:bg-gray-50 transition-colors">
                                        <div class="rounded-full bg-gray-100 p-4 border border-gray-200 shadow-sm">📸
                                        </div>
                                        <p class="text-xs font-bold uppercase tracking-widest text-gray-600">Click or
                                            Drop Cover Image</p>
                                    </button>

                                    <input ref="imageInput" id="image-upload" type="file" accept="image/*"
                                        class="hidden" @change="handleImageSelect" />
                                </div>

                                <!-- Title -->
                                <div
                                    class="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm focus-within:ring-2 focus-within:ring-black transition-shadow">
                                    <label for="story-title"
                                        class="mb-4 block text-[11px] font-black uppercase tracking-[0.2em] text-gray-700">Story
                                        Title</label>
                                    <input id="story-title" v-model="form.title" type="text"
                                        placeholder="Enter an engaging title..."
                                        class="w-full border-none p-0 font-serif text-4xl font-bold placeholder-gray-300 focus:ring-0 outline-none"
                                        required />
                                </div>

                                <!-- Content Body -->
                                <div
                                    class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden focus-within:ring-2 focus-within:ring-black transition-shadow">
                                    <div
                                        class="border-b border-gray-100 bg-gray-50/80 px-8 py-4 flex justify-between items-center text-[11px] font-black uppercase tracking-widest text-gray-600">
                                        <label for="story-content">Article Body</label>
                                        <span class="bg-black text-white px-3 py-1 rounded-md shadow-sm">{{ wordCount }}
                                            Words</span>
                                    </div>
                                    <textarea id="story-content" v-model="form.content" rows="18"
                                        placeholder="Start writing your story here..."
                                        class="w-full border-none p-8 font-mono text-[15px] leading-relaxed placeholder-gray-300 focus:ring-0 outline-none resize-y"
                                        required></textarea>
                                </div>

                                <!-- Intro/Summary -->
                                <div
                                    class="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm focus-within:ring-2 focus-within:ring-black transition-shadow">
                                    <label for="story-summary"
                                        class="mb-4 block text-[11px] font-black uppercase tracking-[0.2em] text-gray-700">SEO
                                        / Short Summary</label>
                                    <textarea id="story-summary" v-model="form.blog_intro" rows="3"
                                        placeholder="A brief hook or meta description..."
                                        class="w-full border-none p-0 text-lg italic text-gray-600 placeholder-gray-300 focus:ring-0 outline-none resize-none"></textarea>
                                </div>
                            </template>
                        </div>

                        <!-- SIDEBAR -->
                        <aside class="space-y-6">
                            <div class="flex flex-col gap-6 lg:sticky lg:top-8">

                                <!-- Publishing Actions -->
                                <div class="rounded-2xl bg-black p-6 text-white shadow-xl">
                                    <h3 class="mb-4 text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">
                                        Publishing Status</h3>

                                    <div v-if="error"
                                        class="mb-4 rounded-lg bg-red-950/50 p-3 border border-red-900/50">
                                        <p class="text-red-400 text-xs font-bold leading-tight flex gap-2 items-start">
                                            <span>⚠️</span> {{ error }}
                                        </p>
                                    </div>

                                    <div class="flex flex-col gap-3">
                                        <button type="submit" :disabled="loading || !isFormValid"
                                            class="w-full rounded-xl bg-white py-4 text-xs font-black uppercase tracking-widest text-black hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md active:scale-[0.98]">
                                            <span v-if="loading" class="flex items-center justify-center gap-2">
                                                <svg class="animate-spin h-4 w-4 text-black"
                                                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle class="opacity-25" cx="12" cy="12" r="10"
                                                        stroke="currentColor" stroke-width="4">
                                                    </circle>
                                                    <path class="opacity-75" fill="currentColor"
                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                                    </path>
                                                </svg>
                                                Processing...
                                            </span>
                                            <span v-else>{{ submitButtonLabel }}</span>
                                        </button>

                                        <!-- LOCAL SAVE BUTTON: Only visible if not a system manager -->
                                        <button v-if="!isSystemManager" type="button" @click="saveToLocal"
                                            class="w-full rounded-xl border border-gray-700 bg-transparent py-3 text-[10px] font-black uppercase tracking-widest text-gray-300 hover:bg-white transition-all">
                                            Save Progress 
                                        </button>
                                    </div>
                                </div>

                                <!-- Category -->
                                <div class="rounded-2xl bg-white p-6 border border-gray-200 shadow-sm">
                                    <label for="category-select"
                                        class="mb-4 block text-[11px] font-black uppercase tracking-[0.2em] text-gray-700">Category</label>
                                    <div class="relative">
                                        <select id="category-select" v-model="form.category"
                                            class="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm font-bold appearance-none outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors">
                                            <option value="" disabled>Select category...</option>
                                            <option v-for="cat in categories" :key="cat.name" :value="cat.name">{{
                                                cat.title || cat.name }}
                                            </option>
                                        </select>
                                        <div
                                            class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                            <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M19 9l-7 7-7-7"></path>
                                            </svg>
                                        </div>
                                    </div>
                                </div>

                                <!-- Tags -->
                                <div class="rounded-2xl bg-white p-6 border border-gray-200 shadow-sm">
                                    <label for="tag-input"
                                        class="mb-4 block text-[11px] font-black uppercase tracking-[0.2em] text-gray-700">Tags</label>
                                    <input id="tag-input" v-model="tagInput" @keydown.enter.prevent="addTag"
                                        placeholder="Press Enter to add tag..."
                                        class="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm focus:border-black focus:ring-1 focus:ring-black outline-none mb-4 transition-colors" />
                                    <div class="flex flex-wrap gap-2">
                                        <span v-for="(tag, i) in form.tags" :key="i"
                                            class="bg-gray-100 border border-gray-200 text-gray-800 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center gap-2 group hover:bg-black hover:text-white transition-colors cursor-pointer"
                                            @click="removeTag(i)">
                                            #{{ tag }}
                                            <span class="opacity-50 group-hover:opacity-100">×</span>
                                        </span>
                                    </div>
                                </div>

                                <!-- Post Management -->
                                <div class="rounded-2xl bg-white p-6 border border-gray-200 shadow-sm">
                                    <div class="flex items-center justify-between mb-4">
                                        <h3 class="text-[11px] font-black uppercase tracking-[0.2em] text-gray-700">{{
                                            sidebarListTitle }}</h3>
                                        <button @click="startFreshStory" type="button"
                                            class="text-[10px] text-blue-600 font-bold hover:text-blue-800 transition-colors uppercase tracking-widest bg-blue-50 px-2 py-1 rounded">New</button>
                                    </div>
                                    <div v-if="isLoadingPendingPosts" class="py-4 text-center">
                                        <span
                                            class="text-xs font-bold uppercase tracking-widest text-gray-400 animate-pulse">Loading...</span>
                                    </div>
                                    <div v-else-if="!pendingPosts.length"
                                        class="text-xs text-gray-400 py-4 italic text-center">No stories
                                        found.</div>
                                    <div v-else class="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                        <div v-for="post in pendingPosts" :key="post.name"
                                            class="rounded-xl border p-3 transition-all cursor-pointer group"
                                            :class="post.name === editingPostName ? 'border-black bg-black text-white shadow-md' : 'border-gray-200 bg-gray-50 hover:bg-white hover:border-gray-300'"
                                            @click="openPendingPost(post.name)">
                                            <div class="flex items-start gap-3">
                                                <div class="min-w-0 flex-1">
                                                    <p class="text-xs font-bold line-clamp-1"
                                                        :class="post.name === editingPostName ? 'text-white' : 'text-gray-900'">
                                                        {{ post.title ||
                                                        'Untitled' }}</p>
                                                    <p class="text-[9px] mt-1 uppercase tracking-widest"
                                                        :class="post.name === editingPostName ? 'text-gray-400' : 'text-gray-500'">
                                                        {{
                                                        formatDate(post.modified) }}</p>
                                                </div>
                                                <button type="button" @click.stop="deletePendingPost(post)"
                                                    :disabled="deletingPostName === post.name"
                                                    class="shrink-0 rounded-lg px-2 py-1 text-[9px] font-bold uppercase tracking-widest transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                                                    :class="post.name === editingPostName ? 'bg-white/10 text-white hover:bg-red-500' : 'bg-gray-200 text-gray-600 hover:bg-red-100 hover:text-red-700'">
                                                    {{ deletingPostName === post.name ? "..." : "Del" }}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </aside>
                    </form>
                </div>

                <!-- PREVIEW TAB -->
                <div v-show="activeTab === 'preview'" class="mx-auto max-w-3xl fade-in pb-20">
                    <div class="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-200">
                        <div v-if="imagePreview" class="h-80 md:h-[28rem] w-full overflow-hidden">
                            <img :src="imagePreview" alt="Preview cover"
                                class="h-full w-full object-cover transition-transform duration-700 hover:scale-105" />
                        </div>
                        <div class="px-8 md:px-16 py-12">
                            <div class="mb-6 flex gap-2">
                                <span v-if="form.category"
                                    class="text-[10px] font-bold uppercase tracking-widest text-blue-600 bg-blue-50 px-3 py-1 rounded-full">{{
                                    form.category }}</span>
                            </div>
                            <h1
                                class="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-8 leading-tight text-gray-900">
                                {{
                                    form.title || "Untitled Story" }}</h1>
                            <div v-if="form.blog_intro"
                                class="mb-10 text-xl font-serif text-gray-600 italic border-l-4 border-black pl-6 py-2 bg-gray-50/50 rounded-r-lg">
                                {{ form.blog_intro }}</div>
                            <div class="preview-content-area prose prose-lg max-w-none prose-p:text-gray-700 prose-headings:font-serif prose-headings:text-black prose-a:text-blue-600"
                                v-html="previewContent"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { blogApi } from "../api/blogServices.js";
import { formatDate, getImageUrl, sanitizeHtml } from "../utils/post";

// Constants
const LOCAL_STORAGE_KEY = "blogger_draft_progress";

// Hooks & Routing
const route = useRoute();
const router = useRouter();

// Auth Mock
const authState = reactive({ user: { role: 'Author' } });
const isSystemManager = computed(() => authState.user.role === 'System Manager');

// Component State
const loading = ref(false);
const error = ref("");
const isSubmitted = ref(false);
const submissionMessage = ref("");
const submittedPostName = ref("");
const categories = ref([]);
const pendingPosts = ref([]);
const isLoadingPendingPosts = ref(false);
const isLoadingCurrentPost = ref(false);
const deletingPostName = ref("");
const activeTab = ref("write");

// Media State
const imagePreview = ref(null);
const imageFile = ref(null);
const imageInput = ref(null);
const isDragOver = ref(false);

// Form State
const tagInput = ref("");
const form = reactive({
    title: "",
    blog_intro: "",
    content: "",
    category: "",
    tags: [],
});

// Computed
const editingPostName = computed(() => route.params.name || "");
const isEditing = computed(() => !!editingPostName.value);
const successTitle = computed(() => isEditing.value ? "Story Updated!" : "Story Submitted!");
const isFormValid = computed(() => form.title.length > 5 && form.content.length > 10);
const wordCount = computed(() => form.content.split(/\s+/).filter(Boolean).length);
const previewContent = computed(() => sanitizeHtml(form.content));

const headerTitle = computed(() => {
    if (isEditing.value) return isSystemManager.value ? "Edit Published Story" : "Edit Pending Story";
    return "Create New Story";
});

const sidebarListTitle = computed(() => isSystemManager.value ? "System Database" : "Your Pending Drafts");

const submitButtonLabel = computed(() => {
    if (isEditing.value) return "Update Changes";
    return isSystemManager.value ? "Publish Immediately" : "Submit for Review";
});

// --- Local Storage Logic ---

const saveToLocal = () => {
    const data = {
        title: form.title,
        blog_intro: form.blog_intro,
        content: form.content,
        category: form.category,
        tags: [...form.tags],
        savedAt: new Date().toISOString()
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));

    alert("Your Blog Saved Successfully!");
};

const loadLocalDraft = () => {
    // Only load if NOT editing an existing API post
    if (isEditing.value) return;

    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
        try {
            const draft = JSON.parse(saved);
            form.title = draft.title || "";
            form.blog_intro = draft.blog_intro || "";
            form.content = draft.content || "";
            form.category = draft.category || "";
            form.tags = Array.isArray(draft.tags) ? draft.tags : [];
            console.log("Draft restored from local storage.");
        } catch (e) {
            console.error("Failed to restore local draft", e);
        }
    }
};

const clearLocalDraft = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
};

// --- Core Functions ---

function applyPostToForm(post) {
    if (!post) return;
    form.title = post.title || "";
    form.blog_intro = post.blog_intro || "";
    form.content = post.content || "";
    form.category = post.blog_category || "";
    form.tags = Array.isArray(post.tags) ? [...post.tags] : [];
    imagePreview.value = post.meta_image ? getImageUrl(post.meta_image) : null;
}

function resetComposerState() {
    Object.assign(form, {
        title: "", blog_intro: "", content: "", category: categories.value[0]?.name || "", tags: []
    });
    clearImage();
    error.value = "";
    activeTab.value = "write";
}

const openPendingPost = async (name) => {
    if (name === editingPostName.value) return;
    await router.push({ name: "CreatePost", params: { name } });
    activeTab.value = "write";
};

const startFreshStory = async () => {
    isSubmitted.value = false;
    submissionMessage.value = "";
    if (editingPostName.value) {
        await router.push({ name: "CreatePost" });
    } else {
        resetComposerState();
    }
};

// Data Fetching
const loadPostData = async (name) => {
    isLoadingCurrentPost.value = true;
    try {
        const post = await blogApi.getMyPendingPost(name);
        applyPostToForm(post);
    } catch (e) {
        error.value = "Unable to load story.";
    } finally {
        isLoadingCurrentPost.value = false;
    }
};

const fetchPendingPosts = async () => {
    isLoadingPendingPosts.value = true;
    try {
        pendingPosts.value = await blogApi.getMyPendingPosts();
    } catch (e) {
        console.error(e);
    } finally {
        isLoadingPendingPosts.value = false;
    }
};

// Watchers
watch(
    () => route.params.name,
    async (newName) => {
        if (newName) await loadPostData(newName);
        else {
            resetComposerState();
            loadLocalDraft();
        }
    },
    { immediate: true }
);

// Handlers
const processFile = (file) => {
    if (file && file.type.startsWith("image/")) {
        imageFile.value = file;
        imagePreview.value = URL.createObjectURL(file);
    }
};
const handleImageDrop = (e) => { isDragOver.value = false; processFile(e.dataTransfer?.files?.[0]); };
const handleImageSelect = (e) => processFile(e.target.files?.[0]);
const clearImage = () => { imagePreview.value = null; imageFile.value = null; };
const openImagePicker = () => imageInput.value?.click();
const addTag = () => {
    const rawTag = tagInput.value.trim().toLowerCase();
    if (rawTag && !form.tags.includes(rawTag)) form.tags.push(rawTag);
    tagInput.value = "";
};
const removeTag = (index) => form.tags.splice(index, 1);

// Mutations
const deletePendingPost = async (post) => {
    if (!window.confirm(`Delete "${post.title}"?`)) return;
    deletingPostName.value = post.name;
    try {
        await blogApi.deleteMyPendingPost(post.name);
        await fetchPendingPosts();
        if (post.name === editingPostName.value) router.push({ name: "CreatePost" });
    } catch (e) {
        error.value = "Delete failed.";
    } finally {
        deletingPostName.value = "";
    }
};

const handleSubmit = async () => {
    if (!isFormValid.value) return;
    loading.value = true;
    try {
        const payload = { ...form, meta_image: imageFile.value };
        let res = isEditing.value
            ? await blogApi.updateMyPendingPost({ name: editingPostName.value, ...payload })
            : await blogApi.createPost(payload);

        submissionMessage.value = res.message || "Saved successfully.";
        isSubmitted.value = true;

        // Clear local storage because the post is now in the database
        clearLocalDraft();
        await fetchPendingPosts();
    } catch (e) {
        error.value = e.message || "Submission error.";
    } finally {
        loading.value = false;
    }
};

onMounted(async () => {
    try { categories.value = await blogApi.getCategories(); } catch (e) { }
    await fetchPendingPosts();
    if (!isEditing.value) loadLocalDraft();
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;600;700;900&display=swap");

.font-serif {
    font-family: "Crimson Pro", Georgia, serif;
}

.fade-in {
    animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(8px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.custom-scrollbar::-webkit-scrollbar {
    width: 4px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: #d1d5db;
    border-radius: 10px;
}

.preview-content-area {
    font-size: 1.125rem;
    line-height: 1.8;
}

:deep(.preview-content-area p) {
    margin-bottom: 1.75rem;
}

:deep(.preview-content-area h2) {
    font-family: "Crimson Pro", serif;
    font-size: 2rem;
    font-weight: 700;
    margin-top: 3rem;
    margin-bottom: 1rem;
    color: #111827;
}
</style>