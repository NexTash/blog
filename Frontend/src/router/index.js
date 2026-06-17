import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import PostDetail from "../views/PostDetail.vue";
import authRoutes from "./auth";

const routes = [
	{ path: "/", name: "Home", component: Home },
	{ path: "/post/:name", name: "PostDetail", component: PostDetail },
	// { path: "/login", name: "Login", component: () => import("../views/Login.vue") },
	// { path: "/signup", name: "Signup", component: () => import("../views/Signup.vue") },
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

export default router;
