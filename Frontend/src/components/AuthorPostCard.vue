<template>
	<article
		class="group overflow-hidden rounded-[1.4rem] border border-[#e7dfd3] bg-white shadow-[0_10px_28px_rgba(15,23,42,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-[#d9d0c3] hover:shadow-[0_20px_44px_rgba(15,23,42,0.09)]"
	>
		<div :class="compact ? 'flex flex-col sm:flex-row' : 'flex flex-col md:flex-row'">
			<div :class="imageWrapperClass">
				<img
					:src="getImageUrl(post?.meta_image)"
					:alt="post?.title || 'Blog cover'"
					class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
				/>
			</div>

			<div class="flex min-w-0 flex-1 flex-col p-5 md:p-6">
				<div class="flex flex-wrap items-center gap-2">
					<span
						class="rounded-full px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.14em]"
						:class="statusBadgeClass"
					>
						{{ statusLabel }}
					</span>
					<span
						class="inline-flex items-center rounded-full border border-[#ece4d8] bg-[#faf7f2] px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.12em] text-gray-700"
					>
						{{ categoryLabel }}
					</span>
				</div>

				<p class="mt-3 text-[9px] font-black uppercase tracking-[0.18em] text-gray-400">
					{{ statusLabel === "Published" ? "Published" : "Updated" }} {{ dateLabel }}
				</p>

				<router-link :to="editTo" class="mt-3 block">
					<h3
						class="editorial-display break-words font-black leading-tight text-gray-900 transition-colors group-hover:text-[#b42318]"
						:class="compact ? 'line-clamp-2 text-[1.45rem]' : 'line-clamp-2 text-[1.6rem] md:text-[1.8rem]'"
					>
						{{ post?.title }}
					</h3>
				</router-link>

				<p
					class="mt-2.5 break-words text-sm leading-6 text-gray-600"
					:class="compact ? 'line-clamp-2' : 'line-clamp-2'"
				>
					{{ summaryText }}
				</p>

				<div class="mt-auto flex flex-wrap items-center gap-2.5 border-t border-[#eee7dd] pt-4">
					<router-link :to="editTo" class="btn-primary min-h-10 justify-center px-4 sm:min-w-[168px]">
						{{ editLabel }}
					</router-link>

					<router-link
						v-if="showViewButton"
						:to="viewTo"
						class="btn-secondary min-h-10 justify-center border-gray-200 bg-white px-4 text-gray-700 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900 sm:min-w-[168px]"
					>
						View post
					</router-link>

					<button
						v-if="showDelete"
						type="button"
						class="inline-flex min-h-10 items-center gap-1.5 rounded-full px-2 text-[10px] font-black uppercase tracking-[0.16em] text-gray-400 transition-colors hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-60 sm:ml-auto"
						:disabled="deleting"
						@click="$emit('delete')"
					>
						<span class="text-base leading-none">×</span>
						<span>{{ deleting ? "Deleting..." : "Delete" }}</span>
					</button>
				</div>
			</div>
		</div>
	</article>
</template>

<script setup>
import { computed } from "vue";
import { formatDate, getImageUrl, stripHtml } from "../utils/post";

const props = defineProps({
	post: {
		type: Object,
		required: true,
	},
	editTo: {
		type: Object,
		required: true,
	},
	viewTo: {
		type: Object,
		default: null,
	},
	editLabel: {
		type: String,
		default: "Edit post",
	},
	showDelete: {
		type: Boolean,
		default: false,
	},
	deleting: {
		type: Boolean,
		default: false,
	},
	compact: {
		type: Boolean,
		default: false,
	},
});

defineEmits(["delete"]);

function getPostStatus(post) {
	return post?.custom_post_status || (post?.published ? "Published" : "Draft");
}

const statusLabel = computed(() => getPostStatus(props.post));

const categoryLabel = computed(
	() => String(props.post?.blog_category || "General").trim() || "General",
);

const dateLabel = computed(() =>
	formatDate(props.post?.published ? props.post?.published_on : props.post?.modified),
);

const summaryText = computed(() => {
	const rawText = String(props.post?.blog_intro || "").replace(/&nbsp;/g, " ");
	const cleaned = stripHtml(rawText).replace(/\s+/g, " ").trim();
	return cleaned || "No summary added for this post yet.";
});

const showViewButton = computed(() => statusLabel.value === "Published" && Boolean(props.viewTo));

const statusBadgeClass = computed(() => {
	if (statusLabel.value === "Published") return "bg-emerald-100 text-emerald-800";
	if (statusLabel.value === "Submitted for Review") return "bg-sky-100 text-sky-800";
	if (statusLabel.value === "Rejected") return "bg-red-100 text-red-800";
	return "bg-amber-100 text-amber-800";
});

const imageWrapperClass = computed(() =>
	props.compact
		? "relative h-44 overflow-hidden bg-gray-100 sm:h-auto sm:w-[156px] shrink-0"
		: "relative h-52 overflow-hidden bg-gray-100 md:h-auto md:w-[190px] shrink-0",
);
</script>
