<template>
	<main
		class="min-h-screen bg-[#f3f2ef] text-[#1a1a1a] selection:bg-[#f5d8d4] selection:text-[#b42318] px-4 py-8 md:py-12"
	>
		<div class="mx-auto max-w-6xl">
			<!-- ══ SUCCESS STATE ══════════════════════════════════════════ -->
			<div
				v-if="isSubmitted"
				class="fade-in flex flex-col items-center justify-center min-h-[70vh]"
			>
				<div
					class="max-w-xl w-full bg-white rounded-3xl p-12 border-2 border-gray-300 shadow-2xl text-center"
				>
					<div
						class="mb-8 inline-flex h-24 w-24 items-center justify-center rounded-full bg-green-50 text-green-600 border-2 border-green-200"
					>
						<svg
							class="h-12 w-12"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2.5"
								d="M5 13l4 4L19 7"
							/>
						</svg>
					</div>

					<h2 class="text-4xl font-serif font-bold text-black mb-6">
						Submission Received!
					</h2>
					<p class="text-lg text-gray-600 mb-10 leading-relaxed">
						Your blog is successfully submitted and
						<span
							class="font-bold text-black underline decoration-red-500 underline-offset-4"
							>waiting for admin approval</span
						>. Once the team reviews and publishes your story, it will appear on the
						public feed.
					</p>

					<router-link
						to="/"
						class="inline-block w-full rounded-xl bg-black py-4 text-[11px] font-black uppercase tracking-[0.3em] text-white transition-all hover:bg-gray-800 active:scale-95 shadow-lg shadow-black/20"
					>
						Navigate to Home Page
					</router-link>

					<button
						@click="isSubmitted = false"
						class="mt-6 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
					>
						Create another story
					</button>
				</div>
			</div>

			<!-- ══ FORM STATE (Write & Preview) ════════════════════════════ -->
			<div v-else>
				<!-- Top Navigation / Header -->
				<header
					class="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between border-b-2 border-gray-300 pb-6"
				>
					<div>
						<nav
							class="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-2"
						>
							<span>Blogger</span>
							<span>/</span>
							<span class="text-black">New Story</span>
						</nav>
						<h1
							class="text-3xl md:text-4xl font-serif font-bold tracking-tight text-black"
						>
							Create New Story
						</h1>
					</div>

					<!-- Tab Bar -->
					<div class="inline-flex rounded-full bg-gray-200 p-1 shadow-inner">
						<button
							type="button"
							@click="activeTab = 'write'"
							:class="
								activeTab === 'write'
									? 'bg-black text-white shadow-md'
									: 'text-gray-600 hover:text-black'
							"
							class="flex items-center gap-2 rounded-full px-6 py-2 text-xs font-bold uppercase tracking-wider transition-all"
						>
							✏️ Write
						</button>
						<button
							type="button"
							@click="activeTab = 'preview'"
							:class="
								activeTab === 'preview'
									? 'bg-black text-white shadow-md'
									: 'text-gray-600 hover:text-black'
							"
							class="flex items-center gap-2 rounded-full px-6 py-2 text-xs font-bold uppercase tracking-wider transition-all"
						>
							👁️ Preview
						</button>
					</div>
				</header>

				<!-- WRITE TAB -->
				<div v-show="activeTab === 'write'" class="fade-in">
					<form
						@submit.prevent="handleSubmit"
						class="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_340px]"
					>
						<!-- Main Content Area -->
						<div class="space-y-8">
							<!-- Cover Image Area -->
							<div
								class="group relative h-72 w-full overflow-hidden rounded-2xl bg-white border-2 border-dashed border-gray-400 transition-all hover:border-black hover:shadow-lg"
								@dragover.prevent="isDragOver = true"
								@dragleave.prevent="isDragOver = false"
								@drop.prevent="handleImageDrop"
							>
								<div v-if="imagePreview" class="h-full w-full">
									<img
										:src="imagePreview"
										alt="Cover preview"
										class="h-full w-full object-cover"
									/>
									<div
										class="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]"
									>
										<button
											type="button"
											@click="clearImage"
											class="rounded-full bg-white px-6 py-2 text-[10px] font-bold uppercase tracking-widest text-black shadow-xl hover:bg-red-600 hover:text-white transition-colors"
										>
											Remove Cover Image
										</button>
									</div>
								</div>
								<button
									v-else
									@click="$refs.imageInput.click()"
									type="button"
									class="flex h-full w-full flex-col items-center justify-center gap-4 transition-colors hover:bg-gray-50"
								>
									<div
										class="rounded-full bg-gray-100 p-4 text-black border border-gray-300"
									>
										<svg
											class="h-8 w-8"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
											/>
										</svg>
									</div>
									<div class="text-center">
										<p
											class="text-sm font-bold text-black uppercase tracking-widest"
										>
											Add Cover Image
										</p>
										<p class="text-[11px] text-gray-500 mt-1 font-medium">
											PNG, JPG, WebP (Max 5MB)
										</p>
									</div>
								</button>
								<input
									ref="imageInput"
									type="file"
									accept="image/*"
									class="hidden"
									@change="handleImageSelect"
								/>
							</div>

							<!-- Title -->
							<div
								class="bg-white rounded-2xl p-8 border-2 border-gray-300 shadow-md transition-shadow hover:shadow-lg focus-within:border-black"
							>
								<label
									class="mb-4 block text-[11px] font-black uppercase tracking-[0.2em] text-black"
									>Story Title</label
								>
								<input
									v-model="form.title"
									type="text"
									placeholder="Enter a compelling title..."
									class="w-full border-none p-0 font-serif text-4xl font-bold placeholder:text-gray-300 focus:ring-0 focus:outline-none text-black"
								/>
							</div>

							<!-- Article Content -->
							<div
								class="bg-white rounded-2xl border-2 border-gray-300 shadow-md overflow-hidden transition-shadow hover:shadow-lg focus-within:border-black"
							>
								<div
									class="border-b-2 border-gray-200 bg-gray-50 px-8 py-4 flex justify-between items-center text-[11px] font-black uppercase tracking-widest text-black"
								>
									<span>Article Body (HTML Supported)</span>
									<span class="bg-black text-white px-2 py-0.5 rounded"
										>{{ wordCount }} Words</span
									>
								</div>
								<textarea
									v-model="form.content"
									rows="18"
									placeholder="Write your story here..."
									class="w-full border-none bg-transparent p-8 font-mono text-[15px] leading-relaxed placeholder:text-gray-300 focus:ring-0 focus:outline-none text-black"
								></textarea>
							</div>

							<!-- Excerpt -->
							<div
								class="bg-white rounded-2xl p-8 border-2 border-gray-300 shadow-md transition-shadow hover:shadow-lg focus-within:border-black"
							>
								<label
									class="mb-4 block text-[11px] font-black uppercase tracking-[0.2em] text-black"
									>Short Summary / Excerpt</label
								>
								<textarea
									v-model="form.blog_intro"
									rows="3"
									placeholder="What is this story about? (Summarize in 2-3 sentences)"
									class="w-full border-none p-0 text-lg leading-relaxed text-gray-800 placeholder:text-gray-300 focus:ring-0 focus:outline-none"
								></textarea>
							</div>
						</div>

						<!-- Sidebar -->
						<aside class="space-y-6">
							<div class="sticky top-8 space-y-6">
								<!-- Publish Card -->
								<div class="rounded-2xl p-6 bg-black text-white shadow-xl">
									<h3
										class="mb-6 text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400 border-b border-gray-800 pb-2"
									>
										Publish Settings
									</h3>
									<p
										v-if="error"
										class="text-red-400 text-[10px] mb-4 font-bold bg-red-950/30 p-2 rounded border border-red-900"
									>
										Error: {{ error }}
									</p>

									<button
										type="submit"
										:disabled="loading || !isFormValid"
										class="w-full rounded-xl bg-white py-4 text-xs font-black uppercase tracking-[0.2em] text-black transition-all hover:bg-gray-200 active:scale-95 disabled:opacity-20"
									>
										{{ loading ? "Publishing..." : "Publish Now" }}
									</button>
									<p
										v-if="!isFormValid"
										class="text-[10px] mt-4 text-center text-gray-500 italic"
									>
										Please fill title and content to enable publishing.
									</p>
								</div>

								<!-- Category Card -->
								<div
									class="rounded-2xl bg-white p-6 border-2 border-gray-300 shadow-md"
								>
									<label
										class="mb-4 block text-[11px] font-black uppercase tracking-[0.2em] text-black"
										>Category</label
									>
									<div class="relative">
										<select
											v-model="form.category"
											class="w-full rounded-xl border-2 border-gray-200 bg-gray-50 px-4 py-3 text-sm font-bold text-black focus:border-black focus:outline-none appearance-none"
										>
											<option value="" disabled>Select category...</option>
											<option
												v-for="cat in categories"
												:key="cat.name"
												:value="cat.name"
											>
												{{ cat.title || cat.name }}
											</option>
										</select>
									</div>
								</div>

								<!-- NEW: Backlinks Card -->
								<div
									class="rounded-2xl bg-white p-6 border-2 border-gray-300 shadow-md"
								>
									<label
										class="mb-4 block text-[11px] font-black uppercase tracking-[0.2em] text-black"
										>Backlinks / Resources</label
									>
									<div class="space-y-2 mb-4">
										<input
											v-model="backlinkInput.label"
											placeholder="Link Label (e.g. Source)"
											class="w-full rounded-lg border-2 border-gray-100 bg-gray-50 px-3 py-2 text-[11px] font-bold text-black focus:border-black focus:outline-none"
										/>
										<input
											v-model="backlinkInput.url"
											placeholder="https://example.com"
											class="w-full rounded-lg border-2 border-gray-100 bg-gray-50 px-3 py-2 text-[11px] font-bold text-black focus:border-black focus:outline-none"
										/>
										<button
											@click.prevent="addBacklink"
											type="button"
											class="w-full bg-gray-100 text-black py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all"
										>
											Add Link
										</button>
									</div>

									<div class="space-y-2">
										<div
											v-for="(link, i) in form.backlinks"
											:key="i"
											class="group flex items-center justify-between bg-gray-50 border border-gray-200 p-2 rounded-lg"
										>
											<div class="overflow-hidden">
												<p
													class="text-[10px] font-bold text-black truncate"
												>
													{{ link.label }}
												</p>
												<p class="text-[9px] text-gray-400 truncate">
													{{ link.url }}
												</p>
											</div>
											<button
												@click="removeBacklink(i)"
												type="button"
												class="text-gray-300 hover:text-red-500 px-2 transition-colors"
											>
												×
											</button>
										</div>
									</div>
								</div>

								<!-- Tags Card -->
								<div
									class="rounded-2xl bg-white p-6 border-2 border-gray-300 shadow-md"
								>
									<label
										class="mb-4 block text-[11px] font-black uppercase tracking-[0.2em] text-black"
										>Tags</label
									>
									<input
										v-model="tagInput"
										@keydown.enter.prevent="addTag"
										placeholder="Type and press Enter"
										class="w-full rounded-lg border-2 border-gray-100 bg-gray-50 px-3 py-2 text-xs font-bold text-black focus:border-black focus:outline-none mb-4"
									/>
									<div class="flex flex-wrap gap-2">
										<span
											v-for="(tag, i) in form.tags"
											:key="tag"
											class="bg-black text-white px-3 py-1 rounded-md text-[10px] font-bold flex items-center gap-2"
										>
											#{{ tag }}
											<button
												@click="removeTag(i)"
												type="button"
												class="text-gray-400 hover:text-red-500 transition-colors"
											>
												×
											</button>
										</span>
									</div>
								</div>
							</div>
						</aside>
					</form>
				</div>

				<!-- PREVIEW TAB -->
				<div v-show="activeTab === 'preview'" class="mx-auto max-w-3xl fade-in">
					<div
						class="bg-white min-h-[80vh] rounded-3xl shadow-2xl overflow-hidden mb-20 border-2 border-gray-200"
					>
						<div v-if="imagePreview" class="h-80 w-full overflow-hidden bg-gray-900">
							<img
								:src="imagePreview"
								alt="Cover"
								class="h-full w-full object-cover"
							/>
						</div>
						<div class="px-8 md:px-16 py-12">
							<div class="mb-8 flex items-center gap-4">
								<span
									class="text-[10px] font-black uppercase tracking-widest text-white bg-black px-4 py-1.5 rounded-full"
									>{{ form.category || "Story" }}</span
								>
								<span
									class="text-[10px] font-bold text-gray-500 uppercase tracking-widest"
									>{{ today }}</span
								>
							</div>
							<h1
								class="font-serif text-4xl md:text-6xl text-black font-bold mb-8 leading-tight"
							>
								{{ form.title || "Untitled Story" }}
							</h1>
							<div
								v-if="form.blog_intro"
								class="mb-10 text-2xl font-serif text-gray-600 italic border-l-8 border-black pl-8 py-4 bg-gray-50"
							>
								{{ form.blog_intro }}
							</div>
							<div
								v-if="form.content"
								class="preview-content-area mb-12"
								v-html="previewContent"
							></div>
							<p v-else class="preview-content-area mb-12 text-gray-300 italic">
								Write some content to see it here...
							</p>

							<!-- Preview Backlinks -->
							<div
								v-if="form.backlinks.length > 0"
								class="border-t-2 border-gray-100 pt-8"
							>
								<h4 class="text-[11px] font-black uppercase tracking-[0.2em] mb-4">
									Resources & Links
								</h4>
								<ul class="space-y-2">
									<li v-for="link in form.backlinks" :key="link.url">
										<a
											:href="getSafeUrl(link.url)"
											target="_blank"
											rel="noopener noreferrer"
											class="text-sm font-bold text-black underline decoration-gray-300 underline-offset-4 hover:decoration-black transition-all"
										>
											{{ link.label }} →
										</a>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</main>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from "vue";
import { blogApi, blogsResource } from "../api/blogServices.js";
import { getSafeUrl, sanitizeHtml } from "../utils/post";

const loading = ref(false);
const error = ref("");
const isSubmitted = ref(false);
const categories = ref([]);
const activeTab = ref("write");
const imagePreview = ref(null);
const imageFile = ref(null);
const tagInput = ref("");
const imageInput = ref(null);

const backlinkInput = reactive({
	label: "",
	url: "",
});

const form = reactive({
	title: "",
	blog_intro: "",
	content: "",
	category: "",
	tags: [],
	backlinks: [],
});

const wordCount = computed(() => {
	const text = form.content.replace(/<[^>]*>/g, " ").trim();
	return text ? text.split(/\s+/).filter(Boolean).length : 0;
});

const today = computed(() =>
	new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
);
const previewContent = computed(() => sanitizeHtml(form.content));

const isFormValid = computed(
	() => form.title.trim().length >= 5 && form.content.trim().length >= 10,
);

const handleImageSelect = (e) => {
	const file = e.target.files?.[0];
	if (file) processImageFile(file);
};

const handleImageDrop = (e) => {
	const file = e.dataTransfer.files?.[0];
	if (file) processImageFile(file);
};

const processImageFile = (file) => {
	if (file.size > 5 * 1024 * 1024) {
		alert("Image is too large (Max 5MB)");
		return;
	}
	imageFile.value = file;
	const reader = new FileReader();
	reader.onload = (e) => {
		imagePreview.value = e.target.result;
	};
	reader.readAsDataURL(file);
};

const clearImage = () => {
	imagePreview.value = null;
	imageFile.value = null;
	if (imageInput.value) imageInput.value.value = "";
};

const addTag = () => {
	if (tagInput.value.trim() && !form.tags.includes(tagInput.value.trim())) {
		form.tags.push(tagInput.value.trim().toLowerCase());
		tagInput.value = "";
	}
};
const removeTag = (i) => form.tags.splice(i, 1);

const addBacklink = () => {
	if (backlinkInput.label && backlinkInput.url) {
		form.backlinks.push({
			label: backlinkInput.label.trim(),
			url: backlinkInput.url.trim(),
		});
		backlinkInput.label = "";
		backlinkInput.url = "";
	}
};

const removeBacklink = (index) => {
	form.backlinks.splice(index, 1);
};

const fetchCategories = async () => {
	try {
		categories.value = await blogApi.getCategories();
		if (categories.value.length > 0 && !form.category) {
			form.category = categories.value[0].name;
		}
	} catch (e) {
		error.value = e.message;
	}
};

onMounted(fetchCategories);

const handleSubmit = async () => {
	if (!isFormValid.value) return;

	error.value = "";
	loading.value = true;

	try {
		await blogApi.createPost({
			title: form.title,
			blog_intro: form.blog_intro,
			content: form.content,
			category: form.category,
			tags: form.tags,
			backlinks: form.backlinks,
			meta_image: imageFile.value,
		});

		if (blogsResource && blogsResource.fetch) {
			await blogsResource.fetch(true);
		}

		isSubmitted.value = true;
		window.scrollTo({ top: 0, behavior: "smooth" });
	} catch (err) {
		error.value = err.message;
	} finally {
		loading.value = false;
	}
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;700;900&display=swap");

.font-serif {
	font-family: "Crimson Pro", serif;
}

.fade-in {
	animation: fadeIn 0.4s ease-out forwards;
}

@keyframes fadeIn {
	from {
		opacity: 0;
		transform: translateY(15px);
	}

	to {
		opacity: 1;
		transform: translateY(0);
	}
}

.preview-content-area {
	font-size: 1.25rem;
	line-height: 1.8;
	color: #1a1a1a;
}

:deep(.preview-content-area p) {
	margin-bottom: 1.75rem;
}
</style>
