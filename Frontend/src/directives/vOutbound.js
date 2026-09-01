/**
 * vOutbound — custom Vue directive
 *
 * Applies UTM rotation + referrer blanking to any <a> element it is placed on.
 * Registers the click interceptor on mount and cleans up on unmount.
 * Also stamps rel="noopener noreferrer nofollow" at the DOM level as a
 * belt-and-suspenders fallback in case JS hasn't executed yet.
 *
 * Global registration (main.js):
 *   app.directive("outbound", vOutbound)
 *
 * Usage in any template:
 *   <a v-outbound href="https://example.com">Link text</a>
 *
 * With an explicit target:
 *   <a v-outbound="'_self'" href="https://example.com">Same tab</a>
 */

import { isOutboundHref, openOutbound } from "@/utils/outbound";

export const vOutbound = {
	mounted(el, binding) {
		// The directive value can optionally override the link target.
		// e.g. v-outbound="_self" — otherwise we fall back to the element's
		// own target attribute, then to "_blank".
		const forceTarget = binding.value ?? null;

		function handler(event) {
			const link = el.tagName === "A" ? el : el.closest("a");
			if (!link) return;

			const href = link.getAttribute("href");
			if (!isOutboundHref(href)) return;

			event.preventDefault();

			const target = forceTarget ?? link.getAttribute("target") ?? "_blank";
			openOutbound(href, target);
		}

		// Store the handler so unmount can remove the exact same reference
		el._outboundHandler = handler;
		el.addEventListener("click", handler);

		// Stamp rel attributes at DOM level (native browser referrer suppression)
		const existing = el.getAttribute("rel") ?? "";
		const parts = new Set(existing.split(/\s+/).filter(Boolean));
		parts.add("noopener");
		parts.add("noreferrer");
		parts.add("nofollow");
		el.setAttribute("rel", [...parts].join(" "));
	},

	// If the binding value changes (e.g. dynamic target), re-register cleanly
	updated(el, binding) {
		if (el._outboundHandler) {
			el.removeEventListener("click", el._outboundHandler);
			delete el._outboundHandler;
		}

		const forceTarget = binding.value ?? null;

		function handler(event) {
			const link = el.tagName === "A" ? el : el.closest("a");
			if (!link) return;

			const href = link.getAttribute("href");
			if (!isOutboundHref(href)) return;

			event.preventDefault();

			const target = forceTarget ?? link.getAttribute("target") ?? "_blank";
			openOutbound(href, target);
		}

		el._outboundHandler = handler;
		el.addEventListener("click", handler);
	},

	unmounted(el) {
		if (el._outboundHandler) {
			el.removeEventListener("click", el._outboundHandler);
			delete el._outboundHandler;
		}
	},
};
