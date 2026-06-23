import { blogApi } from "../api/blogServices";

const VISITOR_ID_KEY = "nextnews_visitor_id";
const SESSION_LOGGED_KEY = "nextnews_traffic_logged";
const MINIMUM_VISIT_MS = 10000;

function createVisitorId() {
	if (window.crypto?.randomUUID) {
		return window.crypto.randomUUID();
	}

	return `visitor-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function getVisitorId() {
	let visitorId = window.localStorage.getItem(VISITOR_ID_KEY);

	if (!visitorId) {
		visitorId = createVisitorId();
		window.localStorage.setItem(VISITOR_ID_KEY, visitorId);
	}

	return visitorId;
}

function getTrafficPayload(route) {
	return {
		route: route.fullPath,
		route_name: route.name || "",
		page_title: document.title,
		referrer: document.referrer,
		visitor_id: getVisitorId(),
		screen_width: window.screen?.width,
		screen_height: window.screen?.height,
		language: navigator.language,
	};
}

export function installTrafficTracker(router) {
	if (window.sessionStorage.getItem(SESSION_LOGGED_KEY)) return;

	window.setTimeout(() => {
		const currentRoute = router.currentRoute.value;
		window.requestIdleCallback?.(() => trackSession(currentRoute)) ||
			window.setTimeout(() => trackSession(currentRoute), 0);
	}, MINIMUM_VISIT_MS);
}

async function trackSession(route) {
	if (window.sessionStorage.getItem(SESSION_LOGGED_KEY)) return;

	try {
		await blogApi.trackTraffic(getTrafficPayload(route));
		window.sessionStorage.setItem(SESSION_LOGGED_KEY, "1");
	} catch {
		// Analytics must never interrupt browsing.
	}
}
