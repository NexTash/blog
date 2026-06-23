const GENERIC_ERROR = "Something went wrong. Please try again.";

const MESSAGE_PATTERNS = [
	{
		test: /reset.*link|link.*(expired|invalid|used)|expired/i,
		message: "This reset link is invalid or has expired.",
	},
	{
		test: /invalid.*(login|credential|password)|authentication|incorrect/i,
		message: "Invalid username or password.",
	},
	{
		test: /already exists|duplicate|already registered/i,
		message: "This email is already registered.",
	},
	{
		test: /password/i,
		message: "Please choose a stronger password.",
	},
	{
		test: /email/i,
		message: "Please enter a valid email address.",
	},
	{
		test: /network|failed to fetch/i,
		message: "Unable to connect. Please check your connection and try again.",
	},
	{
		test: /rate|too many|limit/i,
		message: "Too many attempts. Please wait a while and try again.",
	},
];

export function cleanErrorMessage(error, fallback = GENERIC_ERROR) {
	const rawMessage = typeof error === "string" ? error : error?.message || fallback;
	const message = stripTechnicalDetails(rawMessage);
	const matched = MESSAGE_PATTERNS.find((pattern) => pattern.test.test(message));

	return matched?.message || message || fallback;
}

export function getLoginErrorMessage(error) {
	const message = cleanErrorMessage(error, "Login failed. Please try again.");

	if (/login|credential|password|authentication|incorrect|not found/i.test(message)) {
		return "Invalid username or password.";
	}

	return message;
}

export function getSignupErrorMessage(error) {
	return cleanErrorMessage(error, "Registration failed. Please try again.");
}

export function getForgotPasswordErrorMessage(error) {
	return cleanErrorMessage(error, "We could not send reset instructions. Please try again.");
}

function stripTechnicalDetails(message) {
	return String(message)
		.replace(/Traceback[\s\S]*/i, "")
		.replace(/<[^>]*>/g, "")
		.replace(/^[\w.]+Error:\s*/i, "")
		.replace(/^frappe\.[\w.]+:\s*/i, "")
		.replace(/^[\w.]+Exception:\s*/i, "")
		.replace(/\s+/g, " ")
		.trim();
}
