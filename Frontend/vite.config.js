import path from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import frappeuiPlugin from "frappe-ui/vite";
import proxyOptions from "./proxyOptions";

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
		rollupOptions: {
			checks: {
				pluginTimings: false,
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
