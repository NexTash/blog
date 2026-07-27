import { Extension } from "@tiptap/core";

function hasNofollow(relValue) {
	return String(relValue || "")
		.split(/\s+/)
		.filter(Boolean)
		.includes("nofollow");
}

function normalizeRel(relValue, enabled) {
	const tokens = new Set(
		String(relValue || "")
			.split(/\s+/)
			.filter(Boolean),
	);

	if (enabled) {
		tokens.add("nofollow");
	} else {
		tokens.delete("nofollow");
	}

	const nextRel = Array.from(tokens).join(" ").trim();
	return nextRel || null;
}

export const LinkNofollowExtension = Extension.create({
	name: "linkNofollow",

	addCommands() {
		return {
			toggleLinkNofollow:
				() =>
				({ editor, chain }) => {
					if (!editor.isActive("link")) {
						return false;
					}

					const attributes = editor.getAttributes("link") || {};
					if (!attributes.href) {
						return false;
					}

					const rel = normalizeRel(attributes.rel, !hasNofollow(attributes.rel));

					return chain()
						.focus()
						.extendMarkRange("link")
						.setLink({
							...attributes,
							rel,
						})
						.run();
				},
		};
	},
});

export function isLinkNofollowActive(editor) {
	if (!editor?.isActive("link")) {
		return false;
	}

	return hasNofollow(editor.getAttributes("link")?.rel);
}
