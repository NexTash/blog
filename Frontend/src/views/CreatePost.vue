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
                    <h2 class="editorial-display text-3xl md:text-4xl font-bold text-black mb-4">{{ successTitle }}</h2>
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
                            <h1 class="editorial-display text-3xl md:text-4xl font-bold tracking-tight text-black">
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
                                        class="editorial-display w-full border-none p-0 text-4xl font-bold placeholder-gray-300 focus:ring-0 outline-none"
                                        required />
                                </div>

                                <!-- Content Body -->
                                <PostBodyEditor :key="editorKey" v-model="form.content" :word-count="wordCount" />

                                <!-- Intro/Summary -->
                                <div
                                    class="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm focus-within:ring-2 focus-within:ring-black transition-shadow">
                                    <label for="story-summary"
                                        class="mb-4 block text-[11px] font-black uppercase tracking-[0.2em] text-gray-700">Short
                                        Summary</label>
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
                                        <button ref="publishButton" type="submit"
                                            :disabled="isSavingDraft || isSubmitting || !isFormValid"
                                            class="w-full rounded-xl bg-white py-4 text-xs font-black uppercase tracking-widest text-black hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md active:scale-[0.98]">
                                            <span v-if="isSubmitting" class="flex items-center justify-center gap-2">
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

                                        <button type="button" @click="saveToLocal"
                                            :disabled="isSavingDraft || isSubmitting"
                                            class="w-full rounded-xl border border-gray-700 bg-transparent py-3 text-[10px] uppercase tracking-widest text-black bg-white transition-all">
                                            <span v-if="isSavingDraft">Saving Draft...</span>
                                            <span v-else>{{ saveButtonLabel }}</span>
                                        </button>
                                        <p v-if="localSaveMessage"
                                            class="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400">
                                            {{ localSaveMessage }}
                                        </p>
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

                                <!-- Sources & Links -->
                                <div class="rounded-2xl bg-white p-6 border border-gray-200 shadow-sm">
                                    <div class="mb-4 flex items-center justify-between gap-3">
                                        <label
                                            class="block text-[11px] font-black uppercase tracking-[0.2em] text-gray-700">Links</label>
                                        <button type="button" @click="addBacklink"
                                            class="rounded-lg bg-gray-100 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-gray-700 transition-colors hover:bg-black hover:text-white">
                                            Add Link
                                        </button>
                                    </div>

                                    <div v-if="!form.backlinks.length"
                                        class="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-4 text-xs text-gray-500">
                                        Add source or reference links that should appear with the article.
                                    </div>

                                    <div v-else class="space-y-4">
                                        <div v-for="(backlink, index) in form.backlinks" :key="index"
                                            class="rounded-xl border border-gray-200 bg-gray-50 p-4">
                                            <div class="mb-3 flex items-center justify-between gap-3">
                                                <p
                                                    class="text-[11px] font-black uppercase tracking-[0.14em] text-gray-500">
                                                    Link {{ index + 1 }}
                                                </p>
                                                <button type="button" @click="removeBacklink(index)"
                                                    class="text-[10px] font-black uppercase tracking-widest text-red-600 transition-colors hover:text-red-800">
                                                    Remove
                                                </button>
                                            </div>
                                            <div class="space-y-3">
                                                <input v-model="backlink.label" type="text"
                                                    placeholder="Label (optional)"
                                                    class="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-black focus:ring-1 focus:ring-black" />
                                                <input v-model="backlink.url" type="url"
                                                    placeholder="https://example.com/source"
                                                    class="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-black focus:ring-1 focus:ring-black" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div v-if="isSystemManager"
                                    class="rounded-2xl bg-white p-6 border border-gray-200 shadow-sm">
                                    <label for="cta-button-url"
                                        class="mb-3 block text-[11px] font-black uppercase tracking-[0.2em] text-gray-700">
                                        CTA Button Link
                                    </label>
                                    <input id="cta-button-url" v-model="form.cta_button_url" type="url"
                                        placeholder="https://example.com/get-quote"
                                        class="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm outline-none transition-colors focus:border-black focus:ring-1 focus:ring-black" />
                                    <!-- <p class="mt-3 text-xs leading-6 text-gray-500">
                                        This link is used by the in-article
                                        <span class="font-bold text-gray-700">CTA</span>
                                        block and is editable only for
                                        <span class="font-bold text-gray-700">System Manager</span>.
                                    </p> -->
                                </div>

            
                            </div>
                        </aside>
                    </form>
                </div>

                <!-- PREVIEW TAB -->
                <div v-show="activeTab === 'preview'" class="fade-in pb-20">
                    <div class="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl">
                        <div class="border-b border-gray-200 bg-[#f6f3ee] px-4 py-3">
                            <div class="mx-auto max-w-4xl">
                                <nav class="flex items-center gap-2 text-sm font-bold" aria-label="Preview Breadcrumb">
                                    <span class="text-[#b42318]">Home</span>
                                    <span class="text-gray-500" aria-hidden="true"> > </span>
                                    <span class="truncate text-[#b42318]">{{ form.title || "Untitled Story" }}</span>
                                </nav>
                            </div>
                        </div>

                        <div class="mx-auto max-w-4xl px-4 py-10 md:px-6 md:py-14">
                            <article class="preview-shell">
                                <span v-if="form.category" class="kicker">
                                    {{ form.category }}
                                </span>
                                <span v-else class="kicker">Uncategorized</span>

                                <h1
                                    class="mt-4 text-3xl font-black leading-tight tracking-tight text-gray-900 sm:text-[34px] md:text-[38px]">
                                    {{ form.title || "Untitled Story" }}
                                </h1>

                                <div
                                    class="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-bold uppercase tracking-[0.14em] text-gray-400">
                                    <span>{{
                                        formatDate(new Date().toISOString(), {
                                            month: "long",
                                            day: "numeric",
                                            year: "numeric",
                                        })
                                    }}</span>
                                    <span aria-hidden="true" class="text-gray-300">|</span>
                                    <span>Preview Author</span>
                                </div>

                                <div
                                    class="my-10 overflow-hidden rounded-lg bg-gray-100 shadow-[0_22px_60px_rgba(15,23,42,0.14)]">
                                    <img :src="imagePreview || getImageUrl('')"
                                        :alt="form.title || 'Preview cover image'"
                                        class="max-h-[520px] w-full object-cover" />
                                </div>

                                <p v-if="form.blog_intro" class=" py-4 pl-5 pr-4 text-xl leading-8 md:text-2xl
                                    bg-[#CC2929] opacity-85 text-white shadow-xl/20 rounded-2xl">
                                    {{ form.blog_intro }}
                                </p>

                                <hr v-if="form.blog_intro" class="my-10 border-gray-200" />

                                <div class="article-content" v-html="previewContent"></div>

                                <div v-if="hasPreviewSourcesSection"
                                    class="mt-12 rounded-xl border border-gray-100 bg-gray-50 p-8 shadow-sm">
                                    <div class="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                                        <div class="min-w-0 flex-1">
                                            <h3
                                                class="text-xs font-black uppercase tracking-[0.2em] text-gray-900 mb-6 flex items-center gap-2">
                                                Sources & Resources
                                            </h3>
                                            <ul v-if="previewBacklinks.length" class="space-y-4">
                                                <li v-for="(link, index) in previewBacklinks" :key="`preview-${index}`"
                                                    class="flex items-start gap-3 group">
                                                    <svg class="h-5 w-5 text-[#b42318] mt-0.5 flex-shrink-0 opacity-70 group-hover:opacity-100 transition-opacity"
                                                        fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                    </svg>
                                                    <a :href="link.href" target="_blank" rel="noopener noreferrer"
                                                        class="text-[15px] font-medium text-gray-600 hover:text-[#b42318] transition-colors break-all leading-snug border-b border-transparent hover:border-[#b42318]">
                                                        {{ link.label }}
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                        <div v-if="shouldShowPreviewCta"
                                            class="shrink-0"
                                            :class="previewBacklinks.length ? 'border-t border-gray-200 pt-6 lg:border-t-0 lg:border-l lg:pl-6 lg:pt-0' : ''">
                                            <a
                                                :href="safePreviewCtaButtonUrl"
                                                target="_blank"
                                                rel="noopener noreferrer nofollow"
                                                class="inline-flex w-full items-center justify-center rounded-full bg-[#b42318] px-7 py-4 text-center text-xs font-black uppercase tracking-[0.16em] text-white transition-colors hover:bg-[#971b12] sm:w-auto"
                                            >
                                                Get Free Quote Now!
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                <div class="mt-12 border-t border-gray-200 pt-8">
                                    <h2 class="text-lg font-bold text-gray-900">Disclosure Policy</h2>
                                    <p class="text-sm text-gray-500">
                                        This post may contain links to partner services. We may receive compensation if
                                        you use these services, at no extra cost to you.
                                    </p>
                                </div>
                            </article>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<script setup>
import { computed, onMounted, onUnmounted, reactive, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { blogApi } from "../api/blogServices.js";
import { siteApi } from "../api/siteServices";
import PostBodyEditor from "../components/PostBodyEditor.vue";
import { formatDate, getImageUrl, getSafeUrl, sanitizeHtml, stripHtml } from "../utils/post";

// Hooks & Routing
const route = useRoute();
const router = useRouter();

const userRoles = ref([]);
const isSystemManager = computed(() => userRoles.value.includes("System Manager"));

// Component State
const loading = ref(false);
const isSavingDraft = ref(false);
const isSubmitting = ref(false);
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
const publishButton = ref(null);
const localSaveMessage = ref("");
const objectPreviewUrl = ref("");
const currentPostStatus = ref("Draft");
const currentPostPublished = ref(false);

// Editor key — incrementing this forces Tiptap to remount with fresh content
const editorKey = ref(0);

// Form State
const tagInput = ref("");
const form = reactive({
    title: "",
    blog_intro: "",
    content: "",
    category: "",
    tags: [],
    backlinks: [],
    cta_button_url: "",
});

const editingPostName = computed(() => route.params.name || "");
const isEditing = computed(() => !!editingPostName.value);
const isEditingPublishedPost = computed(
    () => isEditing.value && (currentPostPublished.value || currentPostStatus.value === "Published"),
);
const successTitle = computed(() => {
    if (!isEditing.value) {
        return isSystemManager.value ? "Story Published!" : "Story Submitted!";
    }

    if (isEditingPublishedPost.value && !isSystemManager.value) {
        return "Story Resubmitted!";
    }

    return isSystemManager.value ? "Published Changes Saved!" : "Story Updated!";
});
const plainContent = computed(() => stripHtml(form.content));
const isFormValid = computed(() => {
    const hasTitle = form.title.trim().length > 5;
    const hasContent = plainContent.value.length > 10 || form.content.trim().length > 0;
    return hasTitle && hasContent;
});
const wordCount = computed(() => plainContent.value.split(/\s+/).filter(Boolean).length);
const previewContent = computed(() => sanitizeHtml(form.content));
const safePreviewCtaButtonUrl = computed(() => getSafeUrl(form.cta_button_url));
const shouldShowPreviewCta = computed(
    () => Boolean(form.cta_button_url) && safePreviewCtaButtonUrl.value !== "#",
);
const previewBacklinks = computed(() =>
    form.backlinks
        .map((backlink) => ({
            href: getSafeUrl(backlink?.url),
            label: String(backlink?.label || "Reference Link").trim() || "Reference Link",
        }))
        .filter((backlink) => backlink.href !== "#"),
);
const hasPreviewSourcesSection = computed(
    () => previewBacklinks.value.length > 0 || shouldShowPreviewCta.value,
);

const headerTitle = computed(() => {
    if (isEditing.value) {
        if (isEditingPublishedPost.value) return "Edit Published Story";
        if (currentPostStatus.value === "Submitted for Review") return "Edit Review Submission";
        return "Edit Draft Story";
    }

    return "Create New Story";
});

// const sidebarListTitle = computed(() =>
//     isSystemManager.value ? "Drafts & Review Queue" : "Your Unpublished Stories",
// );

const submitButtonLabel = computed(() => {
    if (isSystemManager.value) {
        if (isEditingPublishedPost.value) return "Save & Publish";
        return isEditing.value ? "Publish Changes" : "Publish Now";
    }

    if (isEditingPublishedPost.value) return "Resubmit for Review";
    return isEditing.value ? "Update Review Submission" : "Submit for Review";
});

const saveButtonLabel = computed(() => {
    if (isEditingPublishedPost.value) {
        return isSystemManager.value ? "Save & Publish" : "Save for Review";
    }

    return "Save Progress";
});

const saveToLocal = async () => {
    try {
        isSavingDraft.value = true;
        const payload = buildSubmitPayload();
        const response = await blogApi.saveDraft({
            name: editingPostName.value || undefined,
            ...payload,
            status: "Draft",
        });

        if (response.post) {
            applyPostToForm(response.post);
        }
        localSaveMessage.value = response.message || "Draft saved successfully.";
        await fetchPendingPosts();

        if (!editingPostName.value && response.name) {
            await router.replace({ name: "CreatePost", params: { name: response.name } });
        }

        error.value = "";
    } catch (e) {
        console.error("Failed to save draft", e);
        error.value = e.message || "Unable to save draft.";
        localSaveMessage.value = "";
    } finally {
        isSavingDraft.value = false;
    }
};



function revokeObjectPreviewUrl() {
    if (objectPreviewUrl.value) {
        URL.revokeObjectURL(objectPreviewUrl.value);
        objectPreviewUrl.value = "";
    }
}

function setImagePreview(url) {
    revokeObjectPreviewUrl();
    imagePreview.value = url;
}

function setImageFromFile(file) {
    imageFile.value = file;
    revokeObjectPreviewUrl();
    objectPreviewUrl.value = URL.createObjectURL(file);
    imagePreview.value = objectPreviewUrl.value;
}

function buildSubmitPayload() {
    return {
        title: form.title.trim(),
        blog_intro: form.blog_intro.trim(),
        content: normalizeLegacyFaqEditorContent(form.content),
        category: form.category,
        tags: [...form.tags],
        backlinks: form.backlinks
            .map((backlink) => ({
                label: String(backlink?.label || "").trim(),
                url: String(backlink?.url || "").trim(),
            }))
            .filter((backlink) => backlink.url),
        cta_button_url: form.cta_button_url.trim(),
        meta_image: imageFile.value,
    };
}

function applyPostToForm(post) {
    if (!post) return;
    imageFile.value = null;
    currentPostStatus.value = post.custom_post_status || (post.published ? "Published" : "Draft");
    currentPostPublished.value = Boolean(post.published);
    form.title = post.title || "";
    form.blog_intro = post.blog_intro || "";
    form.content = normalizeLegacyFaqEditorContent(post.content || "");
    form.category = post.blog_category || "";
    form.tags = Array.isArray(post.tags) ? [...post.tags] : [];
    form.backlinks = Array.isArray(post.backlinks)
        ? post.backlinks.map((backlink) => ({
            label: backlink?.label || "",
            url: backlink?.url || "",
        }))
        : [];
    form.cta_button_url = post.custom_cta_button_url || "";
    setImagePreview(post.meta_image ? getImageUrl(post.meta_image) : null);
    localSaveMessage.value = "";
}

function resetComposerState() {
    currentPostStatus.value = "Draft";
    currentPostPublished.value = false;
    Object.assign(form, {
        title: "",
        blog_intro: "",
        content: "",
        category: categories.value[0]?.name || "",
        tags: [],
        backlinks: [],
        cta_button_url: "",
    });
    clearImage();
    error.value = "";
    localSaveMessage.value = "";
    activeTab.value = "write";
    editorKey.value++;
}

function normalizeLegacyFaqEditorContent(html) {
    if (!html || (!html.includes("faq-accordion") && !html.includes("FAQ:") && !html.includes("CTA:"))) {
        return html || "";
    }

    const template = document.createElement("template");
    template.innerHTML = html;

    template.content.querySelectorAll("blockquote").forEach((node) => {
        const firstParagraph = node.querySelector("p");
        const firstText = (firstParagraph?.textContent || "").trim();
        if (!firstText.startsWith("CTA:")) {
            return;
        }

        const spacer = node.nextElementSibling;
        node.remove();
        if (spacer?.tagName === "P" && !(spacer.textContent || "").trim()) {
            spacer.remove();
        }
    });

    template.content.querySelectorAll('details[data-type="faq-accordion"], details.faq-accordion').forEach((node) => {
        const question = node.querySelector("summary")?.textContent?.trim() || "FAQ: Add your question here";
        const answer =
            node.querySelector(".faq-accordion__answer")?.innerHTML?.trim() || "<p>Add the answer here.</p>";

        const replacement = document.createElement("div");
        replacement.innerHTML = `
            <blockquote>
                <p>FAQ: ${question}</p>
                ${answer}
            </blockquote>
            <p></p>
        `;

        node.replaceWith(...replacement.children);
    });

    const candidates = template.content.querySelectorAll("h1, h2, h3, h4, h5, h6, p");

    candidates.forEach((node) => {
        const text = (node.textContent || "").trim();
        if (!text.startsWith("FAQ:")) {
            return;
        }

        const nextElement = node.nextElementSibling;
        if (!nextElement) {
            return;
        }

        const answerTags = new Set(["P", "BLOCKQUOTE", "UL", "OL", "DIV"]);
        if (!answerTags.has(nextElement.tagName)) {
            return;
        }

        const wrapper = document.createElement("blockquote");
        const questionParagraph = document.createElement("p");
        questionParagraph.textContent = text;

        wrapper.appendChild(questionParagraph);

        if (nextElement.tagName === "BLOCKQUOTE") {
            wrapper.innerHTML += nextElement.innerHTML;
        } else {
            wrapper.appendChild(nextElement.cloneNode(true));
        }

        const spacer = document.createElement("p");
        node.replaceWith(wrapper);
        nextElement.remove();
        wrapper.after(spacer);
    });

    return template.innerHTML;
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
        }
    },
    { immediate: true }
);

// Handlers
const processFile = (file) => {
    if (file && file.type.startsWith("image/")) {
        setImageFromFile(file);
    }
};
const handleImageDrop = (e) => { isDragOver.value = false; processFile(e.dataTransfer?.files?.[0]); };
const handleImageSelect = (e) => processFile(e.target.files?.[0]);
const clearImage = () => {
    revokeObjectPreviewUrl();
    imagePreview.value = null;
    imageFile.value = null;
};
const openImagePicker = () => imageInput.value?.click();
const addTag = () => {
    const rawTag = tagInput.value.trim().toLowerCase();
    if (rawTag && !form.tags.includes(rawTag)) form.tags.push(rawTag);
    tagInput.value = "";
};
const removeTag = (index) => form.tags.splice(index, 1);
const addBacklink = () => form.backlinks.push({ label: "", url: "" });
const removeBacklink = (index) => form.backlinks.splice(index, 1);

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

const handleSubmit = async (event) => {
    if (event?.submitter && event.submitter !== publishButton.value) {
        return;
    }

    if (!isFormValid.value) return;
    error.value = "";
    loading.value = true;
    isSubmitting.value = true;
    try {
        const payload = buildSubmitPayload();
        const res = isEditing.value
            ? await blogApi.updateMyPendingPost({
                name: editingPostName.value,
                ...payload,
                status: isSystemManager.value ? "Published" : "Submitted for Review",
            })
            : await blogApi.createPost({
                ...payload,
                status: isSystemManager.value ? "Published" : "Submitted for Review",
            });

        submissionMessage.value = res.message || "Saved successfully.";
        isSubmitted.value = true;

        await fetchPendingPosts();
    } catch (e) {
        const baseMessage = e.message || "Submission error.";
        error.value = `${baseMessage} You can still use Save Progress to keep this draft in the backend.`;
    } finally {
        loading.value = false;
        isSubmitting.value = false;
    }
};

onMounted(async () => {
    try {
        userRoles.value = await siteApi.getCurrentUserRoles();
    } catch (e) {
        userRoles.value = [];
    }

    try {
        categories.value = await blogApi.getCategories();
        if (!isEditing.value && !form.category && categories.value.length) {
            form.category = categories.value[0].name;
        }
    } catch (e) { }
    await fetchPendingPosts();
});

onUnmounted(() => {
    revokeObjectPreviewUrl();
});
</script>

<style scoped>
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

.article-content {
    font-size: 1.0625rem;
    line-height: 1.85;
    color: #334155;
}

.article-content h1,
.article-content h2,
.article-content h3,
.article-content h4 {
    margin-top: 2rem;
    margin-bottom: 0.75rem;
    font-weight: 900;
    line-height: 1.25;
    color: #020617;
}

.article-content h1 {
    font-size: 2rem;
}

.article-content h2 {
    font-size: 1.625rem;
}

.article-content h3 {
    font-size: 1.375rem;
}

.article-content h4 {
    font-size: 1.125rem;
}

.article-content p {
    margin: 1.25rem 0;
}

.article-content a {
    color: #b42318;
    text-decoration: underline;
    text-underline-offset: 3px;
}

.article-content a:hover {
    color: #971b12;
}

.article-content img {
    display: block;
    margin: 2rem 0;
    max-width: 100%;
    border-radius: 0.5rem;
}

.article-content img[data-align="left"] {
    margin-left: 0;
    margin-right: auto;
}

.article-content img[data-align="center"] {
    margin-left: auto;
    margin-right: auto;
}

.article-content img[data-align="right"] {
    margin-left: auto;
    margin-right: 0;
}

.article-content img[data-float="left"] {
    float: left;
    margin-right: 1.25rem;
    margin-left: 0;
}

.article-content img[data-float="right"] {
    float: right;
    margin-left: 1.25rem;
    margin-right: 0;
}

.article-content blockquote {
    margin: 1.5rem 0;
    padding-left: 1.25rem;
    border-left: 4px solid #b42318;
    color: #475569;
    font-style: italic;
}

.article-content details[data-type="faq-accordion"],
.article-content details.faq-accordion {
    margin: 1.5rem 0;
    overflow: hidden;
    border: 1px solid #e2e8f0;
    border-radius: 1rem;
    background: #f8fafc;
}

.article-content details[data-type="faq-accordion"] summary,
.article-content details.faq-accordion summary {
    cursor: pointer;
    list-style: none;
    padding: 1rem 1.25rem;
    font-weight: 800;
    color: #0f172a;
}

.article-content details[data-type="faq-accordion"] summary::-webkit-details-marker,
.article-content details.faq-accordion summary::-webkit-details-marker {
    display: none;
}

.article-content .faq-accordion__answer {
    white-space: pre-line;
    border-top: 1px solid #e2e8f0;
    padding: 0 1.25rem 1rem;
    color: #475569;
}

.article-content ul,
.article-content ol {
    margin: 1rem 0;
    padding-left: 1.5rem;
}

.article-content ul {
    list-style-type: disc;
}

.article-content ol {
    list-style-type: decimal;
}

.article-content li {
    margin: 0.4rem 0;
}

.article-content code {
    background: #f1f5f9;
    padding: 0.15em 0.4em;
    border-radius: 3px;
    font-size: 0.9em;
    font-family: ui-monospace, monospace;
}

.article-content pre {
    background: #1e293b;
    color: #e2e8f0;
    padding: 1.25rem;
    overflow-x: auto;
    margin: 1.5rem 0;
}

.article-content pre code {
    background: none;
    padding: 0;
    color: inherit;
}

.article-content table {
    width: 100%;
    border-collapse: collapse;
    margin: 1.5rem 0;
    font-size: 0.925rem;
}

.article-content th,
.article-content td {
    border: 1px solid #e2e8f0;
    padding: 0.6rem 0.9rem;
    text-align: left;
}

.article-content th {
    background: #f8fafc;
    font-weight: 700;
}
</style>
