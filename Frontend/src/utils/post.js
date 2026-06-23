import fallbackImage from "../assets/hero.png";

export function getImageUrl(url) {
	if (!url) return fallbackImage;
	if (url.startsWith("/")) return window.location.origin + url;
	return url;
}

export function getSafeUrl(url) {
	if (!url) return "#";

	try {
		const parsedUrl = new URL(url, window.location.origin);
		return ["http:", "https:"].includes(parsedUrl.protocol) ? parsedUrl.href : "#";
	} catch {
		return "#";
	}
}

export function stripHtml(html) {
	if (!html) return "";
	return html.replace(/<[^>]*>?/gm, "").trim();
}

export function sanitizeHtml(html) {
	if (!html) return "";

	const template = document.createElement("template");
	template.innerHTML = html;

	template.content
		.querySelectorAll("script, iframe, object, embed, link, meta")
		.forEach((node) => {
			node.remove();
		});

	template.content.querySelectorAll("*").forEach((node) => {
		[...node.attributes].forEach((attribute) => {
			const name = attribute.name.toLowerCase();
			const value = attribute.value;

			if (name.startsWith("on")) {
				node.removeAttribute(attribute.name);
			}

			if (["href", "src"].includes(name) && getSafeUrl(value) === "#") {
				node.removeAttribute(attribute.name);
			}
		});
	});

	return template.innerHTML;
}

export function formatDate(
	dateStr,
	options = { year: "numeric", month: "short", day: "numeric" },
) {
	if (!dateStr) return "";
	return new Date(dateStr).toLocaleDateString("en-US", options);
}
