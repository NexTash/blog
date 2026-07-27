import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();

const patches = [
	{
		file: "node_modules/frappe-ui/src/components/TextEditor/components/Menu.vue",
		replacements: [
			{
				from: "<button\n                  class=\"rounded p-1 text-base font-medium text-ink-gray-8 transition-colors\"",
				to: "<button\n                  type=\"button\"\n                  class=\"rounded p-1 text-base font-medium text-ink-gray-8 transition-colors\"",
			},
			{
				from: "<button\n                          class=\"w-full h-7 rounded px-2 text-base flex items-center gap-2 hover:bg-surface-gray-3\"",
				to: "<button\n                          type=\"button\"\n                          class=\"w-full h-7 rounded px-2 text-base flex items-center gap-2 hover:bg-surface-gray-3\"",
			},
			{
				from: "<button\n                      v-else\n                      class=\"w-full h-7 rounded px-2 text-base flex items-center gap-2 hover:bg-surface-gray-3\"",
				to: "<button\n                      type=\"button\"\n                      v-else\n                      class=\"w-full h-7 rounded px-2 text-base flex items-center gap-2 hover:bg-surface-gray-3\"",
			},
			{
				from: "<button\n            v-else-if=\"!button.component\"\n            class=\"flex rounded text-ink-gray-8 transition-colors focus-within:ring-0\"",
				to: "<button\n            type=\"button\"\n            v-else-if=\"!button.component\"\n            class=\"flex rounded text-ink-gray-8 transition-colors focus-within:ring-0\"",
			},
			{
				from: "<button\n                  class=\"flex rounded p-1 text-ink-gray-8 transition-colors\"",
				to: "<button\n                  type=\"button\"\n                  class=\"flex rounded p-1 text-ink-gray-8 transition-colors\"",
			},
			{
				from: "<button\n                class=\"flex rounded p-1 text-ink-gray-8 transition-colors\"",
				to: "<button\n                type=\"button\"\n                class=\"flex rounded p-1 text-ink-gray-8 transition-colors\"",
			},
		],
	},
	{
		file: "node_modules/frappe-ui/src/components/TextEditor/components/TextEditorFloatingMenu.vue",
		replacements: [
			{
				from: "<button\n      v-for=\"button in floatingMenuButtons\"",
				to: "<button\n      type=\"button\"\n      v-for=\"button in floatingMenuButtons\"",
			},
		],
	},
];

async function applyPatch({ file, replacements }) {
	const absolutePath = path.join(root, file);
	let source;

	try {
		source = await readFile(absolutePath, "utf8");
	} catch (error) {
		console.warn(`[patch-frappe-ui] Skipped missing file: ${file}`);
		return;
	}

	let updated = source;
	const failures = [];

	for (const { from, to } of replacements) {
		// Already patched — skip silently.
		if (updated.includes(to)) {
			continue;
		}

		if (!updated.includes(from)) {
			// Pattern missing — frappe-ui was likely updated and the source changed.
			// Record the failure so we can abort with a clear error after all patches run.
			failures.push(from.slice(0, 80).replace(/\n/g, "\\n"));
			continue;
		}

		updated = updated.replace(from, to);
	}

	if (failures.length) {
		const lines = failures.map((f) => `  • "${f}..."`).join("\n");
		throw new Error(
			`[patch-frappe-ui] ${failures.length} pattern(s) not found in ${file}.\n` +
			`frappe-ui may have been updated — review and update the patch patterns:\n${lines}`,
		);
	}

	if (updated !== source) {
		await writeFile(absolutePath, updated, "utf8");
		console.log(`[patch-frappe-ui] Patched ${file}`);
	}
}

// Run all patches; collect errors so every failure is reported before we exit.
const results = await Promise.allSettled(patches.map(applyPatch));
const errors = results.filter((r) => r.status === "rejected").map((r) => r.reason?.message || r.reason);

if (errors.length) {
	for (const msg of errors) {
		console.error(msg);
	}
	process.exit(1);
}
