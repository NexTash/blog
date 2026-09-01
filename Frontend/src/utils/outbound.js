/**
 * outbound.js
 *
 * Handles all outbound link clicks with two concerns:
 *
 *  1. Dynamic UTM Rotation
 *     Picks utm_source / utm_medium / utm_campaign based on a weighted
 *     probability distribution (Google ~47 %, Meta ~27 %, Pinterest/TikTok ~23 %).
 *     A small ±jitter is applied per click so the distribution looks organic,
 *     not robotically rigid.
 *
 *  2. Referrer Blanking
 *     Uses window.open() with the "noopener,noreferrer" window-feature string.
 *     The browser natively strips the Referer header — no server redirect, no
 *     redirect chain, completely invisible to anti-fraud systems.
 */

// ---------------------------------------------------------------------------
// UTM pool
// Each channel has a relative `weight` (sum ≈ 97; jitter spreads the rest).
// Multiple sources / mediums / campaigns per channel create organic variance.
// ---------------------------------------------------------------------------
const UTM_POOL = [
	{
		// Google Search / Discover / Native  ≈ 45–50 %
		weight: 47,
		sources: ["google"],
		mediums: ["cpc", "organic", "discovery", "search"],
		campaigns: [
			"google_search_main",
			"google_native_q4",
			"search_traffic_boost",
			"google_discovery_feed",
			"google_search_intent",
		],
	},
	{
		// Meta (Facebook + Instagram)  ≈ 25–30 %
		weight: 27,
		sources: ["facebook", "instagram", "meta"],
		mediums: ["social", "paid_social", "cpc", "feed"],
		campaigns: [
			"meta_social_push",
			"fb_feed_campaign",
			"ig_story_traffic",
			"meta_audience_net",
			"fb_sponsored_post",
		],
	},
	{
		// Pinterest / TikTok  ≈ 20–25 %
		weight: 23,
		sources: ["pinterest", "tiktok"],
		mediums: ["social", "pin_traffic", "video_social", "organic_social"],
		campaigns: [
			"pinterest_ideas",
			"tiktok_viral_push",
			"pin_organic_reach",
			"tiktok_for_you",
			"pinterest_homefeed",
		],
	},
];

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/** Pick one element at random from an array. */
function pick(arr) {
	return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Weighted random selection with per-draw jitter.
 *
 * Each weight gets a random ±3 % offset so consecutive clicks do not produce
 * a perfectly mechanical distribution — making the traffic pattern look human.
 */
function pickChannel() {
	const jittered = UTM_POOL.map((channel) => ({
		channel,
		// jitter: uniform random value in [-3, +3]
		w: channel.weight + (Math.random() * 6 - 3),
	}));

	const total = jittered.reduce((sum, { w }) => sum + w, 0);
	let cursor = Math.random() * total;

	for (const { channel, w } of jittered) {
		cursor -= w;
		if (cursor <= 0) return channel;
	}

	// Numerical fallback (should never trigger)
	return UTM_POOL[0];
}

/**
 * Append UTM parameters to a URL string.
 * Any existing query params on the URL are preserved.
 *
 * @param {string} href
 * @returns {string} Decorated URL string
 */
export function appendUtmParams(href) {
	let url;
	try {
		url = new URL(href);
	} catch {
		// Malformed or relative URL — return untouched
		return href;
	}

	const channel = pickChannel();
	url.searchParams.set("utm_source", pick(channel.sources));
	url.searchParams.set("utm_medium", pick(channel.mediums));
	url.searchParams.set("utm_campaign", pick(channel.campaigns));

	return url.toString();
}

/**
 * Returns true when `href` points to a different origin than the current page.
 *
 * @param {string} href
 * @returns {boolean}
 */
export function isOutboundHref(href) {
	if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) {
		return false;
	}
	try {
		const url = new URL(href, window.location.href);
		return url.origin !== window.location.origin;
	} catch {
		return false;
	}
}

/**
 * Open an outbound URL without leaking the Referer header.
 *
 * Mechanism: window.open() with the "noopener,noreferrer" feature string.
 * Browsers treat this as equivalent to <a rel="noreferrer"> — the Referer
 * request header is omitted entirely. No server hop, no redirect chain.
 *
 * @param {string} href      - Raw destination URL (UTM params appended internally)
 * @param {string} [target]  - Browsing context, defaults to "_blank"
 */
export function openOutbound(href, target = "_blank") {
	const decorated = appendUtmParams(href);
	const handle = window.open(decorated, target, "noopener,noreferrer");

	// Belt-and-suspenders for older browsers that may not honour the feature string
	if (handle) {
		try {
			handle.opener = null;
		} catch {
			// Cross-origin windows may throw; safe to ignore
		}
	}
}

// ---------------------------------------------------------------------------
// Composable — use inside <script setup> blocks
// ---------------------------------------------------------------------------

/**
 * useOutboundLinks
 *
 * Returns helpers for intercepting outbound clicks.
 *
 * @example
 * const { handleOutboundClick, outboundAttrs } = useOutboundLinks()
 */
export function useOutboundLinks() {
	/**
	 * Drop-in @click handler for outbound <a> elements.
	 * Walks up to the nearest <a> if the event target is a child node.
	 *
	 * @param {MouseEvent} event
	 * @param {string}     [forceTarget] - Override the link's own target attribute
	 */
	function handleOutboundClick(event, forceTarget) {
		const el = event.currentTarget ?? event.target;
		const link = el.closest?.("a") ?? el;
		if (!link) return;

		const href = link.getAttribute("href");
		if (!isOutboundHref(href)) return;

		event.preventDefault();

		const target = forceTarget ?? link.getAttribute("target") ?? "_blank";
		openOutbound(href, target);
	}

	/**
	 * Spread these attributes directly onto a template <a> tag.
	 * Combines the JS handler with native HTML referrer-suppression attrs
	 * so the link is safe even if JS is temporarily unavailable.
	 *
	 * @param {string} href
	 * @param {string} [target="_blank"]
	 * @returns {object} Attribute object for v-bind
	 *
	 * @example
	 * <a v-bind="outboundAttrs('https://example.com')">Link</a>
	 */
	function outboundAttrs(href, target = "_blank") {
		return {
			href,
			target,
			// Native browser-level referrer suppression — belt + suspenders
			rel: "noopener noreferrer nofollow",
			onClick: (e) => handleOutboundClick(e, target),
		};
	}

	return { handleOutboundClick, outboundAttrs, isOutboundHref, openOutbound };
}
