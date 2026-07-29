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
	normalizeEditorialFeatureBlocks(template.content);
	normalizeInlineCtaBlocks(template.content);

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

function normalizeInlineCtaBlocks(root) {
	root.querySelectorAll('[data-type="inline-cta-button"]').forEach((node) => {
		const label =
			String(node.getAttribute("data-label") || node.querySelector("a")?.textContent || "").trim() ||
			"Call To Action";
		const href = getSafeUrl(
			node.getAttribute("data-url") || node.querySelector("a")?.getAttribute("href") || "",
		);
		const align = String(node.getAttribute("data-align") || "center").toLowerCase();
		const size = String(node.getAttribute("data-size") || "medium").toLowerCase();
		const bgColor = String(node.getAttribute("data-bg-color") || "#b42318").trim() || "#b42318";
		const wrapper = document.createElement("div");
		wrapper.className = "article-cta article-cta--manual";
		wrapper.setAttribute(
			"data-align",
			["left", "center", "right"].includes(align) ? align : "center",
		);
		wrapper.setAttribute(
			"data-size",
			["small", "medium", "large"].includes(size) ? size : "medium",
		);
		wrapper.setAttribute("data-label", label);
		wrapper.setAttribute("data-url", href === "#" ? "" : href);
		wrapper.setAttribute("data-bg-color", bgColor);

		const link = document.createElement("a");
		link.className = "article-cta__button";
		link.textContent = label;
		link.style.backgroundColor = bgColor;

		if (href !== "#") {
			link.href = href;
			link.target = "_blank";
			link.rel = "noopener noreferrer nofollow";
		} else {
			link.setAttribute("aria-disabled", "true");
		}

		wrapper.appendChild(link);

		const replaceTarget =
			node.parentElement?.tagName === "P" &&
			node.parentElement.childNodes.length === 1
				? node.parentElement
				: node;

		replaceTarget.replaceWith(wrapper);
	});
}

function normalizeEditorialFeatureBlocks(root) {
	root.querySelectorAll('[data-type="editorial-feature"]').forEach((node) => {
		const title =
			String(
				node.getAttribute("data-title") ||
					node.querySelector(".article-feature__headline")?.textContent ||
					"",
			).trim() || "Add section heading";
		const rawBody = getEditorialFeatureBody(node) || "Add supporting copy here.";
		const imageUrl = getSafeUrl(
			node.getAttribute("data-image-url") ||
				node.querySelector(".article-feature__image")?.getAttribute("src") ||
				"",
		);
		const imageAlt = String(
			node.getAttribute("data-image-alt") ||
				node.querySelector(".article-feature__image")?.getAttribute("alt") ||
				"",
		).trim();
		const caption = String(
			node.getAttribute("data-caption") ||
				node.querySelector(".article-feature__caption")?.textContent ||
				"",
		).trim();
		const imagePosition = normalizeEditorialFeatureLayout(
			node.getAttribute("data-layout") || node.getAttribute("data-image-position"),
		);

		const wrapper = document.createElement("div");
		const classes = ["article-feature"];
		if (imagePosition === "right") {
			classes.push("article-feature--reverse");
		}
		if (imageUrl === "#") {
			classes.push("article-feature--no-media");
		}

		wrapper.setAttribute("data-type", "editorial-feature");
		wrapper.setAttribute("data-title", title);
		wrapper.setAttribute("data-body", rawBody);
		wrapper.setAttribute("data-image-url", imageUrl === "#" ? "" : imageUrl);
		wrapper.setAttribute("data-image-alt", imageAlt);
		wrapper.setAttribute("data-caption", caption);
		wrapper.setAttribute("data-layout", imagePosition);
		wrapper.className = classes.join(" ");

		if (imageUrl !== "#") {
			const figure = document.createElement("figure");
			figure.className = "article-feature__media";

			const image = document.createElement("img");
			image.className = "article-feature__image";
			image.src = imageUrl;
			image.alt = imageAlt;
			figure.appendChild(image);

			if (caption) {
				const figcaption = document.createElement("figcaption");
				figcaption.className = "article-feature__caption";
				figcaption.textContent = caption;
				figure.appendChild(figcaption);
			}

			wrapper.appendChild(figure);
		}

		const content = document.createElement("div");
		content.className = "article-feature__content";

		const headline = document.createElement("h3");
		headline.className = "article-feature__headline";
		headline.textContent = title;
		content.appendChild(headline);

		const body = document.createElement("div");
		body.className = "article-feature__body";

		splitEditorialFeatureParagraphs(rawBody).forEach((paragraphText) => {
			const paragraph = document.createElement("p");
			paragraph.textContent = paragraphText;
			body.appendChild(paragraph);
		});

		content.appendChild(body);
		wrapper.appendChild(content);

		node.replaceWith(wrapper);
	});
}

function getEditorialFeatureBody(node) {
	const bodyFromAttribute = String(node.getAttribute("data-body") || "").trim();
	if (bodyFromAttribute) {
		return bodyFromAttribute;
	}

	const bodyContainer = node.querySelector(".article-feature__body");
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

function splitEditorialFeatureParagraphs(body) {
	const paragraphs = String(body || "")
		.split(/\n\s*\n/g)
		.map((paragraph) => paragraph.trim())
		.filter(Boolean);

	return paragraphs.length ? paragraphs : ["Add supporting copy here."];
}

function normalizeEditorialFeatureLayout(value) {
	const layout = String(value || "left").toLowerCase();
	return ["left", "right"].includes(layout) ? layout : "left";
}

export function formatDate(
	dateStr,
	options = { year: "numeric", month: "short", day: "numeric" },
) {
	if (!dateStr) return "";
	return new Date(dateStr).toLocaleDateString("en-US", options);
}
