import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import PostDetail from "../views/PostDetail.vue";
import authRoutes from "./auth";

const routes = [
	{ path: "/", name: "Home", component: Home },
	{ path: "/post/:name", name: "PostDetail", component: PostDetail },
	{
		path: "/category/:slug",
		name: "Category",
		component: () => import("../views/Category.vue"),
	},
	{
		path: "/create-post",
		name: "CreatePost",
		component: () => import("../views/CreatePost.vue"),
		meta: { requiresAuth: true },
	},
	...authRoutes,
];

const router = createRouter({
	history: createWebHistory("/Frontend"),
	routes,
});

router.beforeEach(async (to, from, next) => {
	if (to.meta.requiresAuth) {
		// Check Frappe session — guest means not logged in
		try {
			const res = await fetch("/api/method/frappe.auth.get_logged_user");
			const data = await res.json();
			const user = data?.message;
			if (!user || user === "Guest") {
				return next({ name: "Login", query: { route: to.fullPath } });
			}
		} catch {
			return next({ name: "Login", query: { route: to.fullPath } });
		}
	}
	next();
});

export default router;
