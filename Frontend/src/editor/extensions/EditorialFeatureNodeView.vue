<template>
	<NodeViewWrapper as="div" class="not-prose my-4 w-full max-w-full min-w-0">
		<div
			class="w-full max-w-full min-w-0 rounded-[26px] border bg-white p-4 shadow-sm md:p-5"
			:class="selected ? 'border-[#b42318] ring-2 ring-[#f5d8d4]' : 'border-gray-200'"
		>
			<div class="flex flex-wrap items-center gap-2">
				<button
					type="button"
					data-drag-handle
					class="inline-flex cursor-grab items-center gap-2 rounded-full border border-gray-300 bg-gray-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.16em] text-gray-600 active:cursor-grabbing"
					aria-label="Drag feature block"
					title="Drag to reposition this feature block"
				>
					<span class="text-xs leading-none">::</span>
					<span>Feature</span>
				</button>

				<div class="ml-auto flex flex-wrap items-center gap-2">
					<button
						type="button"
						class="rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] transition-colors"
						:class="
							imagePosition === 'left'
								? 'border-[#b42318] bg-[#fff4f1] text-[#b42318]'
								: 'border-gray-300 bg-white text-gray-600'
						"
						@click="setImagePosition('left')"
					>
						Image Left
					</button>
					<button
						type="button"
						class="rounded-full border px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] transition-colors"
						:class="
							imagePosition === 'right'
								? 'border-[#b42318] bg-[#fff4f1] text-[#b42318]'
								: 'border-gray-300 bg-white text-gray-600'
						"
						@click="setImagePosition('right')"
					>
						Image Right
					</button>
					<button
						type="button"
						class="rounded-full border border-red-200 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-red-600 transition-colors hover:bg-red-50"
						@click="deleteNode()"
					>
						Remove
					</button>
				</div>
			</div>

			<div class="mt-4 grid gap-3 md:grid-cols-2">
				<input
					:value="title"
					type="text"
					placeholder="Section heading"
					class="rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm font-semibold outline-none transition-colors focus:border-black focus:ring-1 focus:ring-black"
					@input="updateField('title', $event.target.value)"
				/>
				<input
					:value="imageAlt"
					type="text"
					placeholder="Image alt text"
					class="rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm outline-none transition-colors focus:border-black focus:ring-1 focus:ring-black"
					@input="updateField('imageAlt', $event.target.value)"
				/>
				<input
					:value="caption"
					type="text"
					placeholder="Image caption"
					class="rounded-2xl border border-gray-300 bg-gray-50 px-4 py-3 text-sm outline-none transition-colors focus:border-black focus:ring-1 focus:ring-black md:col-span-2"
					@input="updateField('caption', $event.target.value)"
				/>
			</div>

			<div class="mt-3 flex flex-wrap items-center gap-2">
				<button
					type="button"
					class="rounded-full bg-black px-4 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
					:disabled="isUploading"
					@click="openFilePicker"
				>
					{{ isUploading ? "Uploading..." : "Upload From Device" }}
				</button>
				<button
					v-if="imageUrl"
					type="button"
					class="rounded-full border border-red-200 bg-white px-4 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-red-600 transition-colors hover:bg-red-50"
					@click="clearImage"
				>
					Remove Image
				</button>
				<input
					ref="fileInput"
					type="file"
					accept="image/*"
					class="hidden"
					@change="handleFileSelection"
				/>
			</div>

			<p v-if="uploadError" class="mt-3 text-sm font-medium text-red-600">
				{{ uploadError }}
			</p>

			<textarea
				:value="body"
				rows="5"
				placeholder="Add the supporting paragraph for this section. Separate paragraphs with a blank line."
				class="mt-3 w-full rounded-[24px] border border-gray-300 bg-gray-50 px-4 py-4 text-sm leading-7 outline-none transition-colors focus:border-black focus:ring-1 focus:ring-black"
				@input="updateField('body', $event.target.value)"
			></textarea>

			<div
				class="editorial-feature-preview mt-6"
				:class="imagePosition === 'right' ? 'editorial-feature-preview--reverse' : ''"
			>
				<figure v-if="imageUrl" class="editorial-feature-preview__media">
					<img
						:src="resolvedImageUrl"
						:alt="imageAlt || title"
						class="aspect-[5/4] w-full object-cover"
					/>
					<figcaption v-if="caption" class="mt-3 text-center text-sm font-black text-[#46362a]">
						{{ caption }}
					</figcaption>
				</figure>

				<div class="editorial-feature-preview__content">
					<h3 class="text-2xl font-black leading-tight text-[#111827] md:text-[2rem]">
						{{ title }}
					</h3>
					<div class="mt-5 space-y-4 text-base leading-8 text-[#334155]">
						<p v-for="(paragraph, index) in bodyParagraphs" :key="index">
							{{ paragraph }}
						</p>
					</div>
				</div>
			</div>
		</div>
	</NodeViewWrapper>
</template>

<script setup>
import { computed, ref } from "vue";
import { NodeViewWrapper, nodeViewProps } from "@tiptap/vue-3";
import { blogApi } from "../../api/blogServices.js";
import { getImageUrl } from "../../utils/post";

const props = defineProps(nodeViewProps);

const fileInput = ref(null);
const isUploading = ref(false);
const uploadError = ref("");

const title = computed(() => String(props.node.attrs.title || "").trim() || "Add section heading");
const body = computed(() => String(props.node.attrs.body || "").trim() || "Add supporting copy here.");
const imageUrl = computed(() => String(props.node.attrs.imageUrl || "").trim());
const imageAlt = computed(() => String(props.node.attrs.imageAlt || "").trim());
const caption = computed(() => String(props.node.attrs.caption || "").trim());
const imagePosition = computed(() => {
	const value = String(props.node.attrs.imagePosition || "left").toLowerCase();
	return ["left", "right"].includes(value) ? value : "left";
});
const bodyParagraphs = computed(() => {
	const paragraphs = body.value
		.split(/\n\s*\n/g)
		.map((paragraph) => paragraph.trim())
		.filter(Boolean);

	return paragraphs.length ? paragraphs : ["Add supporting copy here."];
});
const resolvedImageUrl = computed(() => getImageUrl(imageUrl.value));

function updateField(field, value) {
	props.updateAttributes({ [field]: value });
}

function setImagePosition(value) {
	props.updateAttributes({ imagePosition: value });
}

function openFilePicker() {
	uploadError.value = "";
	fileInput.value?.click();
}

async function handleFileSelection(event) {
	const file = event.target.files?.[0];
	event.target.value = "";

	if (!file) {
		return;
	}

	await uploadSelectedFile(file);
}

async function uploadSelectedFile(file) {
	if (!file.type.startsWith("image/")) {
		uploadError.value = "Please choose an image file.";
		return;
	}

	isUploading.value = true;
	uploadError.value = "";

	try {
		const uploaded = await blogApi.uploadImageFile(file);
		const nextUrl = String(uploaded?.file_url || uploaded?.message?.file_url || "").trim();
		if (!nextUrl) {
			throw new Error("Image uploaded, but no file URL was returned.");
		}

		props.updateAttributes({
			imageUrl: nextUrl,
			imageAlt: imageAlt.value || file.name.replace(/\.[^.]+$/, ""),
		});
	} catch (error) {
		uploadError.value = error.message || "Unable to upload image.";
	} finally {
		isUploading.value = false;
	}
}

function clearImage() {
	props.updateAttributes({
		imageUrl: "",
		imageAlt: "",
		caption: "",
	});
}
</script>

<style scoped>
.editorial-feature-preview {
	display: grid;
	gap: 1.5rem;
	align-items: start;
	width: 100%;
	max-width: 100%;
	min-width: 0;
}

.editorial-feature-preview__media {
	margin: 0;
	min-width: 0;
}

.editorial-feature-preview__media img {
	display: block;
	width: 100%;
	border-radius: 1.4rem;
}

.editorial-feature-preview__content {
	min-width: 0;
}

@media (min-width: 768px) {
	.editorial-feature-preview {
		grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr);
	}

	.editorial-feature-preview--reverse .editorial-feature-preview__media {
		order: 2;
	}

	.editorial-feature-preview--reverse .editorial-feature-preview__content {
		order: 1;
	}
}
</style>
