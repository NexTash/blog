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

export function sanitizeHtml(html, options = {}) {
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

	removeLegacyCtaBlocks(template.content);
	upgradeFaqAccordions(template.content);

	return template.innerHTML;
}

function removeLegacyCtaBlocks(root) {
	root.querySelectorAll("blockquote").forEach((node) => {
		const firstParagraph = node.querySelector("p");
		const firstText = (firstParagraph?.textContent || "").trim();
		if (!firstText.startsWith("CTA:")) {
			return;
		}

		const spacer = node.nextElementSibling;
		node.remove();
		if (spacer?.tagName === "P" && !(spacer.textContent || "").trim()) {
			spacer.remove();
		}
	});
}

function upgradeFaqAccordions(root) {
	const faqBlockquotes = root.querySelectorAll("blockquote");

	faqBlockquotes.forEach((node) => {
		const paragraphs = [...node.querySelectorAll("p")];
		if (!paragraphs.length) {
			return;
		}

		const questionText = (paragraphs[0].textContent || "").trim();
		if (!questionText.startsWith("FAQ:")) {
			return;
		}

		const question = questionText.replace(/^FAQ:\s*/i, "").trim() || "FAQ question";
		const details = document.createElement("details");
		details.setAttribute("data-type", "faq-accordion");
		details.className = "faq-accordion";

		const summary = document.createElement("summary");
		summary.className = "faq-accordion__summary";
		summary.textContent = question;

		const answer = document.createElement("div");
		answer.className = "faq-accordion__answer";
		answer.innerHTML = paragraphs
			.slice(1)
			.map((paragraph) => paragraph.outerHTML)
			.join("") || "<p>Add the answer here.</p>";

		details.append(summary, answer);
		node.replaceWith(details);
	});

	const candidates = root.querySelectorAll("h1, h2, h3, h4, h5, h6, p");

	candidates.forEach((node) => {
		const text = (node.textContent || "").trim();
		if (!text.startsWith("FAQ:")) {
			return;
		}

		const nextElement = node.nextElementSibling;
		if (!nextElement) {
			return;
		}

		const answerTags = new Set(["P", "BLOCKQUOTE", "UL", "OL", "DIV"]);
		if (!answerTags.has(nextElement.tagName)) {
			return;
		}

		const question = text.replace(/^FAQ:\s*/i, "").trim() || "FAQ question";
		const details = document.createElement("details");
		details.setAttribute("data-type", "faq-accordion");
		details.className = "faq-accordion";

		const summary = document.createElement("summary");
		summary.className = "faq-accordion__summary";
		summary.textContent = question;

		const answer = document.createElement("div");
		answer.className = "faq-accordion__answer";
		answer.innerHTML =
			nextElement.tagName === "BLOCKQUOTE" ? nextElement.innerHTML : nextElement.outerHTML;

		details.append(summary, answer);
		nextElement.remove();
		node.replaceWith(details);
	});
}

export function formatDate(
	dateStr,
	options = { year: "numeric", month: "short", day: "numeric" },
) {
	if (!dateStr) return "";
	return new Date(dateStr).toLocaleDateString("en-US", options);
}
