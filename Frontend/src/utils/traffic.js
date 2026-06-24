import { blogApi } from "../api/blogServices";

const VISITOR_ID_KEY = "nextnews_visitor_id";
const SESSION_LOGGED_PREFIX = "nextnews_traffic_logged";
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
	window.setTimeout(() => {
		const currentRoute = router.currentRoute.value;
		window.requestIdleCallback?.(() => trackCurrentSession(currentRoute)) ||
			window.setTimeout(() => trackCurrentSession(currentRoute), 0);
	}, MINIMUM_VISIT_MS);
}

export async function trackCurrentSession(route) {
	const user = await getCurrentUser();
	const sessionKey = getSessionLoggedKey(user);

	if (window.sessionStorage.getItem(sessionKey)) return;

	try {
		await blogApi.trackTraffic(getTrafficPayload(route));
		window.sessionStorage.setItem(sessionKey, "1");
	} catch {
		// Analytics must never interrupt browsing.
	}
}

async function getCurrentUser() {
	try {
		const response = await fetch("/api/method/frappe.auth.get_logged_user");
		const data = await response.json();
		return data?.message || "Guest";
	} catch {
		return "Guest";
	}
}

function getSessionLoggedKey(user) {
	if (!user || user === "Guest") {
		return `${SESSION_LOGGED_PREFIX}:guest`;
	}

	return `${SESSION_LOGGED_PREFIX}:user:${user}`;
}
