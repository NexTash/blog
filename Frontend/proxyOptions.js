export default {
	"^/(app|api|assets|files|private)": {
		target: "http://blog.local:8000",
		ws: true,
		changeOrigin: true,
	},
};
