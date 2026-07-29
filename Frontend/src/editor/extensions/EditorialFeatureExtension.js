import { Node, mergeAttributes } from "@tiptap/core";
import { VueNodeViewRenderer } from "@tiptap/vue-3";
import EditorialFeatureNodeView from "./EditorialFeatureNodeView.vue";

function normalizeImagePosition(value) {
	const position = String(value || "left").toLowerCase();
	return ["left", "right"].includes(position) ? position : "left";
}

function splitBodyIntoParagraphs(body) {
	return String(body || "")
		.split(/\n\s*\n/g)
		.map((paragraph) => paragraph.trim())
		.filter(Boolean);
}

function getBodyFromElement(element) {
	const bodyFromAttribute = String(element.getAttribute("data-body") || "").trim();
	if (bodyFromAttribute) {
		return bodyFromAttribute;
	}

	const bodyContainer = element.querySelector(".article-feature__body");
	if (!bodyContainer) {
		return "";
	}

	const paragraphs = [...bodyContainer.querySelectorAll("p")]
		.map((paragraph) => (paragraph.textContent || "").trim())
		.filter(Boolean);

	if (paragraphs.length) {
		return paragraphs.join("\n\n");
	}

	return (bodyContainer.textContent || "").trim();
}

export const EditorialFeatureExtension = Node.create({
	name: "editorialFeature",

	group: "block",
	atom: true,
	selectable: true,
	draggable: true,

	addAttributes() {
		return {
			title: {
				default: "Add section heading",
				parseHTML: (element) =>
					String(
						element.getAttribute("data-title") ||
							element.querySelector(".article-feature__headline")?.textContent ||
							"",
					).trim() || "Add section heading",
			},
			body: {
				default: "Add supporting copy here.",
				parseHTML: (element) =>
					getBodyFromElement(element) || "Add supporting copy here.",
			},
			imageUrl: {
				default: "",
				parseHTML: (element) =>
					String(
						element.getAttribute("data-image-url") ||
							element.querySelector(".article-feature__image")?.getAttribute("src") ||
							"",
					).trim(),
			},
			imageAlt: {
				default: "",
				parseHTML: (element) =>
					String(
						element.getAttribute("data-image-alt") ||
							element.querySelector(".article-feature__image")?.getAttribute("alt") ||
							"",
					).trim(),
			},
			caption: {
				default: "",
				parseHTML: (element) =>
					String(
						element.getAttribute("data-caption") ||
							element.querySelector(".article-feature__caption")?.textContent ||
							"",
					).trim(),
			},
			imagePosition: {
				default: "left",
				parseHTML: (element) =>
					normalizeImagePosition(
						element.getAttribute("data-layout") || element.getAttribute("data-image-position"),
					),
			},
		};
	},

	parseHTML() {
		return [{ tag: 'div[data-type="editorial-feature"]' }];
	},

	renderHTML({ HTMLAttributes, node }) {
		const title = String(node.attrs.title || "").trim() || "Add section heading";
		const body = String(node.attrs.body || "").trim() || "Add supporting copy here.";
		const imageUrl = String(node.attrs.imageUrl || "").trim();
		const imageAlt = String(node.attrs.imageAlt || "").trim();
		const caption = String(node.attrs.caption || "").trim();
		const imagePosition = normalizeImagePosition(node.attrs.imagePosition);
		const bodyParagraphs = splitBodyIntoParagraphs(body);
		const classes = [
			"article-feature",
			imagePosition === "right" ? "article-feature--reverse" : "",
			imageUrl ? "" : "article-feature--no-media",
		]
			.filter(Boolean)
			.join(" ");

		const contentChildren = [
			["h3", { class: "article-feature__headline" }, title],
			[
				"div",
				{ class: "article-feature__body" },
				...(bodyParagraphs.length
					? bodyParagraphs.map((paragraph) => ["p", {}, paragraph])
					: [["p", {}, "Add supporting copy here."]]),
			],
		];

		const children = [];

		if (imageUrl) {
			const figureChildren = [
				["img", { src: imageUrl, alt: imageAlt, class: "article-feature__image" }],
			];

			if (caption) {
				figureChildren.push(["figcaption", { class: "article-feature__caption" }, caption]);
			}

			children.push(["figure", { class: "article-feature__media" }, ...figureChildren]);
		}

		children.push(["div", { class: "article-feature__content" }, ...contentChildren]);

		return [
			"div",
			mergeAttributes(HTMLAttributes, {
				"data-type": "editorial-feature",
				"data-title": title,
				"data-body": body,
				"data-image-url": imageUrl,
				"data-image-alt": imageAlt,
				"data-caption": caption,
				"data-layout": imagePosition,
				class: classes,
			}),
			...children,
		];
	},

	addNodeView() {
		return VueNodeViewRenderer(EditorialFeatureNodeView);
	},

	addCommands() {
		return {
			insertEditorialFeature:
				(attributes = {}) =>
				({ commands }) =>
					commands.insertContent({
						type: this.name,
						attrs: {
							title: attributes.title || "Add section heading",
							body: attributes.body || "Add supporting copy here.",
							imageUrl: attributes.imageUrl || "",
							imageAlt: attributes.imageAlt || "",
							caption: attributes.caption || "",
							imagePosition: normalizeImagePosition(attributes.imagePosition),
						},
					}),
		};
	},
});
