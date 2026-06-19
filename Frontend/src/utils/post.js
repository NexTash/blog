import fallbackImage from "../assets/hero.png";

export function getImageUrl(url) {
	if (!url) return fallbackImage;
	if (url.startsWith("/")) return window.location.origin + url;
	return url;
}

export function stripHtml(html) {
	if (!html) return "";
	return html.replace(/<[^>]*>?/gm, "").trim();
}

export function formatDate(dateStr, options = { year: "numeric", month: "short", day: "numeric" }) {
	if (!dateStr) return "";
	return new Date(dateStr).toLocaleDateString("en-US", options);
}
