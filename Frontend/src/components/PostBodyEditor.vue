<template>
	<div
		class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-visible focus-within:ring-2 focus-within:ring-black transition-shadow"
	>
		<div
			class="border-b border-gray-100 bg-gray-50/80 px-8 py-4 flex justify-between items-center text-[11px] font-black uppercase tracking-widest text-gray-600"
		>
			<label for="story-content">Article Body</label>
			<span class="bg-black text-white px-3 py-1 rounded-md shadow-sm">
				{{ wordCount }} Words
			</span>
		</div>

		<div class="editor-toolbar border-b border-gray-100 bg-white px-5 py-3">
			<div class="flex flex-wrap gap-2">
				<button type="button" class="editor-btn" :class="buttonState(isActive('bold'))" :aria-pressed="String(isActive('bold'))" @click="run((ed) => ed.chain().focus().toggleBold().run())">
					Bold
				</button>
				<button type="button" class="editor-btn" :class="buttonState(isActive('italic'))" :aria-pressed="String(isActive('italic'))" @click="run((ed) => ed.chain().focus().toggleItalic().run())">
					Italic
				</button>
				<button type="button" class="editor-btn" :class="buttonState(isActive('heading', { level: 2 }))" :aria-pressed="String(isActive('heading', { level: 2 }))" @click="run((ed) => ed.chain().focus().toggleHeading({ level: 2 }).run())">
					H2
				</button>
				<button type="button" class="editor-btn" :class="buttonState(isActive('heading', { level: 3 }))" :aria-pressed="String(isActive('heading', { level: 3 }))" @click="run((ed) => ed.chain().focus().toggleHeading({ level: 3 }).run())">
					H3
				</button>
				<button type="button" class="editor-btn" :class="buttonState(isActive('bulletList'))" :aria-pressed="String(isActive('bulletList'))" @click="run((ed) => ed.chain().focus().toggleBulletList().run())">
					Bullets
				</button>
				<button type="button" class="editor-btn" :class="buttonState(isActive('orderedList'))" :aria-pressed="String(isActive('orderedList'))" @click="run((ed) => ed.chain().focus().toggleOrderedList().run())">
					Numbers
				</button>
				<button type="button" class="editor-btn" :class="buttonState(isActive('blockquote'))" :aria-pressed="String(isActive('blockquote'))" @click="run((ed) => ed.chain().focus().toggleBlockquote().run())">
					Quote
				</button>
				<button type="button" class="editor-btn" :class="buttonState(isActive('link'))" :aria-pressed="String(isActive('link'))" @click="toggleLink">
					Link
				</button>
				<button type="button" class="editor-btn" @click="openImagePicker">
					Image
				</button>
				<button type="button" class="editor-btn" :class="disabledButtonState(canUndo)" :disabled="!canUndo" @click="run((ed) => ed.chain().focus().undo().run())">
					Undo
				</button>
				<button type="button" class="editor-btn" :class="disabledButtonState(canRedo)" :disabled="!canRedo" @click="run((ed) => ed.chain().focus().redo().run())">
					Redo
				</button>
			</div>
		</div>

		<div ref="editorShell" class="editor-shell overflow-visible">
			<EditorContent id="story-content" :editor="editor" class="create-post-editor min-h-[28rem] px-8 py-6 text-[15px] leading-relaxed focus:outline-none" />
		</div>

		<input ref="imageInput" type="file" accept="image/*" multiple class="hidden" @change="handleImageSelect" />

		<div class="border-t border-gray-100 px-8 py-3 text-xs text-gray-500">
			<p>
				Use the toolbar to format text, insert images, and click an inserted image to reveal its resize handle.
			</p>
			<p v-if="uploadStatus" class="mt-2 font-semibold text-gray-600">
				{{ uploadStatus }}
			</p>
			<p v-if="uploadError" class="mt-2 font-semibold text-red-600">
				{{ uploadError }}
			</p>
		</div>
	</div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, shallowRef, watch } from "vue";
import { Editor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import { Placeholder } from "@tiptap/extensions";
import "frappe-ui/editor-style.css";
import { ImageExtension } from "../../node_modules/frappe-ui/src/components/TextEditor/extensions/image";
import { LinkExtension } from "../../node_modules/frappe-ui/src/components/TextEditor/extensions/link";

const props = defineProps({
	modelValue: {
		type: String,
		default: "",
	},
	wordCount: {
		type: Number,
		default: 0,
	},
});

const emit = defineEmits(["update:modelValue"]);

const imageInput = ref(null);
const editorShell = ref(null);
const editor = shallowRef(null);
const uploadQueueCount = ref(0);
const uploadError = ref("");

const uploadStatus = computed(() => {
	if (!uploadQueueCount.value) return "";
	return uploadQueueCount.value === 1
		? "Uploading image..."
		: `Uploading ${uploadQueueCount.value} images...`;
});

function getCsrfToken() {
	return window.csrf_token || window.frappe?.csrf_token || "";
}

async function uploadEditorImage(file) {
	uploadQueueCount.value += 1;
	uploadError.value = "";

	const formData = new FormData();
	formData.append("file", file, file.name);
	formData.append("is_private", "0");
	formData.append("folder", "Home");

	try {
		const response = await fetch("/api/method/upload_file", {
			method: "POST",
			headers: {
				Accept: "application/json",
				"X-Frappe-CSRF-Token": getCsrfToken(),
			},
			body: formData,
		});

		const payload = await response.json().catch(() => null);
		if (!response.ok) {
			const message =
				payload?._error_message ||
				payload?.message ||
				"Image upload failed.";
			throw new Error(message);
		}

		return payload?.message || payload;
	} catch (error) {
		uploadError.value = error?.message || "Image upload failed.";
		throw error;
	} finally {
		uploadQueueCount.value = Math.max(0, uploadQueueCount.value - 1);
	}
}

function createEditor() {
		return new Editor({
			content: props.modelValue || "",
			editorProps: {
				attributes: {
					class: "ProseMirror prose prose-v2 max-w-none focus:outline-none",
				},
			},
			extensions: [
			StarterKit.configure({
				code: false,
				codeBlock: false,
				horizontalRule: false,
				dropcursor: true,
			}),
			Placeholder.configure({
				placeholder:
					"Write the article, format it, and insert images exactly where you want them.",
			}),
			LinkExtension.configure({
				openOnClick: false,
			}),
			ImageExtension.configure({
				uploadFunction: uploadEditorImage,
			}),
		],
		onUpdate: ({ editor: currentEditor }) => {
			emit("update:modelValue", currentEditor.getHTML());
		},
	});
}

watch(
	() => props.modelValue,
	(value) => {
		if (!editor.value) return;
		const incoming = value || "";
		if (editor.value.getHTML() !== incoming) {
			editor.value.commands.setContent(incoming, false);
		}
	},
);

const buttonState = (active) =>
	active ? "bg-black text-white border-black" : "bg-white text-gray-700 border-gray-300";

const disabledButtonState = (enabled) =>
	enabled ? "bg-white text-gray-700 border-gray-300" : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed";

const canUndo = computed(() => editor.value?.can().chain().focus().undo().run() ?? false);
const canRedo = computed(() => editor.value?.can().chain().focus().redo().run() ?? false);

function isActive(name, attrs) {
	return editor.value?.isActive(name, attrs) ?? false;
}

const run = (command) => {
	if (!editor.value) return;
	command(editor.value);
};

const openImagePicker = () => {
	imageInput.value?.click();
};

const handleImageSelect = async (event) => {
	const files = Array.from(event.target.files || []);
	if (!files.length || !editor.value) return;

	const imageFiles = files.filter((file) => file.type.startsWith("image/"));
	const rejectedFiles = files.length - imageFiles.length;

	if (rejectedFiles) {
		uploadError.value = "Only image files can be added to the article body.";
	}

	for (const file of imageFiles) {
		editor.value.commands.uploadImage(file);
	}

	event.target.value = "";
};

const toggleLink = () => {
	if (!editor.value) return;
	editor.value.commands.openLinkEditor();
};

onMounted(() => {
	editor.value = createEditor();
});

onBeforeUnmount(() => {
	editor.value?.destroy();
	editor.value = null;
});
</script>

<style scoped>
.editor-btn {
	@apply rounded-lg border px-3 py-2 text-[11px] font-black uppercase tracking-[0.12em] transition-colors;
}

:deep(.create-post-editor .ProseMirror) {
	min-height: 28rem;
	max-width: none;
	outline: none;
}

:deep(.create-post-editor .ProseMirror p.is-editor-empty:first-child::before) {
	color: #9ca3af;
	font-style: normal;
}

:deep(.create-post-editor .ProseMirror img) {
	max-width: 100%;
	border-radius: 0.75rem;
}

:deep(.editor-shell) {
	overflow: visible;
}

:deep(.editor-shell .group.relative.overflow-hidden.not-prose) {
	overflow: visible;
}

:deep(.editor-shell .ProseMirror-selectednode) {
	outline: none;
}

:deep(.create-post-editor .ProseMirror p) {
	margin: 1rem 0;
}

:deep(.create-post-editor .ProseMirror h2) {
	margin-top: 1.75rem;
	margin-bottom: 0.75rem;
	font-size: 1.75rem;
	font-weight: 900;
	line-height: 1.2;
}

:deep(.create-post-editor .ProseMirror h3) {
	margin-top: 1.5rem;
	margin-bottom: 0.75rem;
	font-size: 1.35rem;
	font-weight: 800;
	line-height: 1.25;
}

:deep(.create-post-editor .ProseMirror ul) {
	list-style: disc;
	padding-left: 1.5rem;
}

:deep(.create-post-editor .ProseMirror ol) {
	list-style: decimal;
	padding-left: 1.5rem;
}

:deep(.create-post-editor .ProseMirror blockquote) {
	margin: 1.5rem 0;
	border-left: 4px solid #b42318;
	padding-left: 1rem;
	color: #475569;
	font-style: italic;
}

:deep(.create-post-editor .ProseMirror a) {
	color: #b42318;
	text-decoration: underline;
	text-underline-offset: 3px;
}
</style>
