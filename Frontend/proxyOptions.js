export default {
	"^/(app|api|assets|files|private)": {
		target: "http://127.0.0.1:8000",
		ws: true,
		changeOrigin: true,
		headers: {
			Host: "blog.local",
		},
	},
};
