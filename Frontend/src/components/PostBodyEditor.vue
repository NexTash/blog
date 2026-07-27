<template>
	<div
		class="overflow-visible rounded-2xl border border-gray-200 bg-white shadow-sm focus-within:ring-2 focus-within:ring-black transition-shadow"
	>
		<div
			class="flex flex-col gap-3 border-b border-gray-100 bg-gray-50/80 px-4 py-4 text-[11px] font-black uppercase tracking-widest text-gray-600 sm:flex-row sm:items-center sm:justify-between sm:px-8"
		>
			<label for="story-content">Article Body</label>
			<span class="inline-flex w-fit bg-black px-3 py-1 text-white rounded-md shadow-sm">
				{{ wordCount }} Words
			</span>
		</div>

		<TextEditor
			id="story-content"
			class="w-full bg-white"
			editor-class="prose-v2 prose-sm max-w-none min-h-[22rem] px-4 py-5 focus:outline-none sm:min-h-[28rem] sm:px-8 sm:py-6"
			:content="modelValue || null"
			:placeholder="placeholder"
			:extensions="editorExtensions"
			:fixed-menu="false"
			:bubble-menu="true"
			@change="(content) => emit('update:modelValue', content || '')"
		>
			<template #top>
				<div
					class="sticky top-14 z-30 overflow-x-auto rounded-t-lg border-b border-outline-gray-modals bg-surface-white/95 backdrop-blur sm:top-16"
				>
					<TextEditorFixedMenu :buttons="editorButtons" />
				</div>
			</template>
		</TextEditor>
	</div>
</template>

<script setup>
import { computed } from "vue";
import { TextEditor, TextEditorFixedMenu } from "frappe-ui";
import {
	LinkNofollowExtension,
	isLinkNofollowActive,
} from "../editor/extensions/LinkNofollowExtension";

const editorExtensions = [LinkNofollowExtension];

const nofollowButton = {
	label: "Toggle nofollow",
	text: "NF",
	action: (editor) => editor.chain().focus().toggleLinkNofollow().run(),
	isActive: (editor) => isLinkNofollowActive(editor),
	isDisabled: (editor) => !editor?.isActive("link"),
};

const faqButton = {
	label: "Insert FAQ / accordion block",
	text: "FAQ",
	action: (editor) =>
		editor
			.chain()
			.focus()
			.insertContent([
				{
					type: "blockquote",
					content: [
						{
							type: "paragraph",
							content: [{ type: "text", text: "FAQ: Add your question here" }],
						},
						{
							type: "paragraph",
							content: [{ type: "text", text: "Add the answer here." }],
						},
					],
				},
				{ type: "paragraph" },
			])
			.run(),
};

defineProps({
	modelValue: {
		type: String,
		default: "",
	},
	wordCount: {
		type: Number,
		default: 0,
	},
	placeholder: {
		type: String,
		default: "Write the article, format it, and insert images exactly where you want them.",
	},
});

const editorButtons = computed(() => {
	const buttons = [
		"Paragraph",
		["Heading 1", "Heading 2", "Heading 3", "Heading 4", "Heading 5", "Heading 6"],
		"Separator",
		"Bold",
		"Italic",
		"Strikethrough",
		"Link",
		nofollowButton,
		"FontColor",
		"Separator",
		"Bullet List",
		"Numbered List",
		"Task List",
		"Separator",
		"Align Left",
		"Align Center",
		"Align Right",
		"Separator",
		"Image",
		"Video",
		"Blockquote",
		"Code",
		"Iframe",
		"Separator",
		"Horizontal Rule",
		faqButton,
		[
			"InsertTable",
			"AddColumnBefore",
			"AddColumnAfter",
			"DeleteColumn",
			"AddRowBefore",
			"AddRowAfter",
			"DeleteRow",
			"MergeCells",
			"SplitCell",
			"ToggleHeaderColumn",
			"ToggleHeaderRow",
			"ToggleHeaderCell",
			"DeleteTable",
		],
		"Separator",
		"TableOfContents",
	];

	buttons.push("Separator", "Undo", "Redo");
	return buttons;
});

const emit = defineEmits(["update:modelValue"]);
</script>
