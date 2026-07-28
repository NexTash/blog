<template>
	<NodeViewWrapper as="div" class="not-prose my-3">
		<div
			class="rounded-xl border bg-white p-3 shadow-sm"
			:class="selected ? 'border-[#b42318] ring-2 ring-[#f5d8d4]' : 'border-gray-200'"
		>
			<div class="flex flex-wrap items-center gap-2">
				<button
					type="button"
					data-drag-handle
					class="inline-flex cursor-grab items-center gap-2 rounded-full border border-gray-300 bg-gray-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-gray-600 active:cursor-grabbing"
					aria-label="Drag CTA block"
					title="Drag to reposition this CTA block"
				>
					<span class="text-xs leading-none">::</span>
					<span>CTA</span>
				</button>

				<input
					:value="label"
					type="text"
					placeholder="Button text"
					class="min-w-[180px] flex-1 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm outline-none transition-colors focus:border-black focus:ring-1 focus:ring-black"
					@input="updateField('label', $event.target.value)"
				/>

				<input
					:value="url"
					type="url"
					placeholder="https://example.com"
					class="min-w-[220px] flex-[1.3] rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm outline-none transition-colors focus:border-black focus:ring-1 focus:ring-black"
					@input="updateField('url', $event.target.value)"
				/>

				<button
					type="button"
					class="rounded-full border border-red-200 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-red-600 transition-colors hover:bg-red-50"
					@click="deleteNode()"
				>
					Remove
				</button>
			</div>

			<div class="mt-3 flex flex-wrap items-center gap-2">
				<button
					type="button"
					class="rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] transition-colors"
					:class="align === 'left' ? 'border-[#b42318] bg-[#fff4f1] text-[#b42318]' : 'border-gray-300 bg-white text-gray-600'"
					@click="setAlign('left')"
				>
					Left
				</button>
				<button
					type="button"
					class="rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] transition-colors"
					:class="align === 'center' ? 'border-[#b42318] bg-[#fff4f1] text-[#b42318]' : 'border-gray-300 bg-white text-gray-600'"
					@click="setAlign('center')"
				>
					Center
				</button>
				<button
					type="button"
					class="rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] transition-colors"
					:class="align === 'right' ? 'border-[#b42318] bg-[#fff4f1] text-[#b42318]' : 'border-gray-300 bg-white text-gray-600'"
					@click="setAlign('right')"
				>
					Right
				</button>
			</div>

			<div class="mt-3 flex flex-wrap items-center gap-2">
				<button
					type="button"
					class="rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] transition-colors"
					:class="size === 'small' ? 'border-[#b42318] bg-[#fff4f1] text-[#b42318]' : 'border-gray-300 bg-white text-gray-600'"
					@click="setSize('small')"
				>
					Small
				</button>
				<button
					type="button"
					class="rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] transition-colors"
					:class="size === 'medium' ? 'border-[#b42318] bg-[#fff4f1] text-[#b42318]' : 'border-gray-300 bg-white text-gray-600'"
					@click="setSize('medium')"
				>
					Medium
				</button>
				<button
					type="button"
					class="rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] transition-colors"
					:class="size === 'large' ? 'border-[#b42318] bg-[#fff4f1] text-[#b42318]' : 'border-gray-300 bg-white text-gray-600'"
					@click="setSize('large')"
				>
					Large
				</button>

				<label class="ml-1 inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-gray-600">
					Color
					<input
						:value="bgColor"
						type="color"
						class="h-5 w-7 cursor-pointer border-none bg-transparent p-0"
						@input="updateField('bgColor', $event.target.value)"
					/>
				</label>
			</div>

			<div class="mt-3 flex items-center" :class="previewJustifyClass">
				<a
					:href="safeUrl"
					target="_blank"
					rel="noopener noreferrer nofollow"
					class="article-cta__button"
					:class="[sizeClass, safeUrl === '#' ? 'pointer-events-none opacity-60' : '']"
					:style="{ backgroundColor: bgColor }"
					@click.prevent
				>
					{{ label }}
				</a>
			</div>
		</div>
	</NodeViewWrapper>
</template>

<script setup>
import { computed } from "vue";
import { NodeViewWrapper, nodeViewProps } from "@tiptap/vue-3";

const props = defineProps(nodeViewProps);

const label = computed(() => String(props.node.attrs.label || "").trim() || "Call To Action");
const url = computed(() => String(props.node.attrs.url || ""));
const align = computed(() => {
	const value = String(props.node.attrs.align || "center").toLowerCase();
	return ["left", "center", "right"].includes(value) ? value : "center";
});
const size = computed(() => {
	const value = String(props.node.attrs.size || "medium").toLowerCase();
	return ["small", "medium", "large"].includes(value) ? value : "medium";
});
const bgColor = computed(() => String(props.node.attrs.bgColor || "#b42318"));
const previewJustifyClass = computed(() => {
	if (align.value === "left") return "justify-start";
	if (align.value === "right") return "justify-end";
	return "justify-center";
});
const sizeClass = computed(() => {
	if (size.value === "small") return "article-cta__button--small";
	if (size.value === "large") return "article-cta__button--large";
	return "article-cta__button--medium";
});
const safeUrl = computed(() => {
	try {
		const parsed = new URL(url.value, window.location.origin);
		return ["http:", "https:"].includes(parsed.protocol) ? parsed.href : "#";
	} catch {
		return "#";
	}
});

function updateField(field, value) {
	props.updateAttributes({ [field]: value });
}

function setAlign(value) {
	props.updateAttributes({ align: value });
}

function setSize(value) {
	props.updateAttributes({ size: value });
}
</script>

<style scoped>
.article-cta__button {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	border-radius: 9999px;
	text-align: center;
	font-weight: 900;
	letter-spacing: 0.16em;
	text-transform: uppercase;
	color: #fff;
	text-decoration: none;
	transition: background-color 0.2s ease;
}

.article-cta__button--small {
	padding: 0.6rem 1rem;
	font-size: 0.625rem;
}

.article-cta__button--medium {
	padding: 0.9rem 1.4rem;
	font-size: 0.75rem;
}

.article-cta__button--large {
	padding: 1.15rem 2rem;
	font-size: 0.875rem;
}

.article-cta__button:hover {
	color: #fff;
	filter: brightness(0.9);
}
</style>
