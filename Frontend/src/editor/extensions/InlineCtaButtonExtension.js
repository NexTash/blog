import { Node, mergeAttributes } from "@tiptap/core";
import { VueNodeViewRenderer } from "@tiptap/vue-3";
import InlineCtaButtonNodeView from "./InlineCtaButtonNodeView.vue";

export const InlineCtaButtonExtension = Node.create({
	name: "inlineCtaButton",

	group: "block",
	atom: true,
	selectable: true,
	draggable: true,

	addAttributes() {
		return {
			label: {
				default: "Call To Action",
				parseHTML: (element) =>
					element.getAttribute("data-label") ||
					element.querySelector("a")?.textContent ||
					"Call To Action",
			},
			url: {
				default: "",
				parseHTML: (element) =>
					element.getAttribute("data-url") || element.querySelector("a")?.getAttribute("href") || "",
			},
			align: {
				default: "center",
				parseHTML: (element) => {
					const align = (element.getAttribute("data-align") || "center").toLowerCase();
					return ["left", "center", "right"].includes(align) ? align : "center";
				},
			},
			size: {
				default: "medium",
				parseHTML: (element) => {
					const size = (element.getAttribute("data-size") || "medium").toLowerCase();
					return ["small", "medium", "large"].includes(size) ? size : "medium";
				},
			},
			bgColor: {
				default: "#b42318",
				parseHTML: (element) => element.getAttribute("data-bg-color") || "#b42318",
			},
		};
	},

	parseHTML() {
		return [{ tag: 'div[data-type="inline-cta-button"]' }];
	},

	renderHTML({ HTMLAttributes, node }) {
		const label = String(node.attrs.label || "").trim() || "Call To Action";
		const url = String(node.attrs.url || "").trim();

		return [
			"div",
			mergeAttributes(HTMLAttributes, {
				"data-type": "inline-cta-button",
				"data-label": label,
				"data-url": url,
				"data-align": node.attrs.align || "center",
				"data-size": node.attrs.size || "medium",
				"data-bg-color": node.attrs.bgColor || "#b42318",
				class: "article-cta article-cta--manual",
			}),
			[
				"a",
				{
					href: url,
					target: "_blank",
					rel: "noopener noreferrer nofollow",
					class: "article-cta__button",
				},
				label,
			],
		];
	},

	addNodeView() {
		return VueNodeViewRenderer(InlineCtaButtonNodeView);
	},

	addCommands() {
		return {
			insertInlineCtaButton:
				(attributes = {}) =>
				({ commands }) =>
					commands.insertContent({
						type: this.name,
						attrs: {
							label: attributes.label || "Call To Action",
							url: attributes.url || "",
							align: attributes.align || "center",
							size: attributes.size || "medium",
							bgColor: attributes.bgColor || "#b42318",
						},
					}),
		};
	},
});
