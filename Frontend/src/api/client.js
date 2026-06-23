const API_BASE = "/api/method";

export class ApiError extends Error {
	constructor(message, response, payload) {
		super(message);
		this.name = "ApiError";
		this.response = response;
		this.payload = payload;
	}
}

export function getCsrfToken() {
	return window.csrf_token || window.frappe?.csrf_token || "";
}

export function getServerMessage(payload) {
	if (!payload) return "An unexpected error occurred.";

	if (payload._server_messages) {
		try {
			const messages = JSON.parse(payload._server_messages);
			return messages.map(parseServerMessage).filter(Boolean).join(", ");
		} catch {
			return "Server Error";
		}
	}

	return payload.exception || payload.message || "An unexpected error occurred.";
}

function parseServerMessage(message) {
	try {
		const parsed = JSON.parse(message);
		return parsed.message || parsed.title || "";
	} catch {
		return message;
	}
}

async function parseJson(response) {
	try {
		return await response.json();
	} catch {
		return null;
	}
}

export async function request(path, options = {}) {
	const response = await fetch(`${API_BASE}/${path}`, options);
	const payload = await parseJson(response);

	if (!response.ok) {
		throw new ApiError(getServerMessage(payload), response, payload);
	}

	return payload?.message ?? payload;
}

export async function getResource(doctype, name) {
	const response = await fetch(
		`/api/resource/${encodeURIComponent(doctype)}/${encodeURIComponent(name)}`,
	);
	const payload = await parseJson(response);

	if (!response.ok) {
		throw new ApiError(getServerMessage(payload), response, payload);
	}

	return payload?.data ?? null;
}

export function postJson(path, body) {
	return request(path, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"X-Frappe-CSRF-Token": getCsrfToken(),
		},
		body: JSON.stringify(body),
	});
}

export function postForm(path, formData) {
	return request(path, {
		method: "POST",
		headers: {
			"X-Frappe-CSRF-Token": getCsrfToken(),
		},
		body: formData,
	});
}
