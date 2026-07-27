import path from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import frappeuiPlugin from "frappe-ui/vite";
import proxyOptions from "./proxyOptions";

function getNodeModulePackageName(id) {
	const normalized = id.split("node_modules/")[1];
	if (!normalized) return null;

	const parts = normalized.split("/");
	if (parts[0].startsWith("@")) {
		return `${parts[0]}/${parts[1]}`;
	}

	return parts[0];
}

export default defineConfig({
	plugins: [
		vue(),
		frappeuiPlugin({
			frappeProxy: false,
			jinjaBootData: false,
			buildConfig: false,
		}),
	],
	server: {
		port: 8080,
		host: "0.0.0.0",
		proxy: proxyOptions,
	},
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "src"),
		},
	},
	build: {
		outDir: "../blog/public/Frontend",
		emptyOutDir: true,
		target: "es2015",
		// The text editor route is already lazy-loaded; this keeps Vite from warning
		// about the known heavy editor chunk on every build.
		chunkSizeWarningLimit: 650,
		rollupOptions: {
			checks: {
				pluginTimings: false,
			},
			output: {
				manualChunks(id) {
					if (id.includes("frappe-ui/src/components/TextEditor/extensions/")) {
						const extensionPath = id.split("frappe-ui/src/components/TextEditor/extensions/")[1];
						const extensionName = extensionPath?.split("/")[0];
						if (extensionName) {
							return `frappe-te-${extensionName}`;
						}
					}

					if (id.includes("frappe-ui/src/components/TextEditor/components/")) {
						const componentPath = id.split("frappe-ui/src/components/TextEditor/components/")[1];
						const componentName = componentPath?.split("/")[0]?.replace(/\.\w+$/, "");
						if (componentName) {
							return `frappe-te-comp-${componentName}`;
						}
					}

					if (id.includes("frappe-ui/src/components/TextEditor")) {
						return "frappe-te-core";
					}

					if (id.includes("node_modules/frappe-ui")) {
						return "frappe-ui";
					}

					if (!id.includes("node_modules")) return;

					const packageName = getNodeModulePackageName(id);
					if (!packageName) return;

					if (packageName.startsWith("@tiptap/")) {
						return `tiptap-${packageName.split("/")[1]}`;
					}

					if (packageName.startsWith("prosemirror-")) {
						return `pm-${packageName.replace("prosemirror-", "")}`;
					}

					if (
						[
							"@floating-ui/dom",
							"@floating-ui/core",
							"@floating-ui/utils",
							"highlight.js",
							"lowlight",
							"markdown-it",
							"mdurl",
							"linkify-it",
							"uc.micro",
							"reka-ui",
						].includes(packageName)
					) {
						return packageName.replace(/[@/]/g, "-");
					}
				},
			},
			onLog(level, log, handler) {
				if (
					log.code === "INVALID_ANNOTATION" &&
					log.id?.includes("node_modules/reka-ui/node_modules/@vueuse/core")
				) {
					return;
				}

				handler(level, log);
			},
		},
	},
});
