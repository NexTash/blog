export default [
	{
		path: "/login",
		name: "Login",
		component: () => import("../views/Login.vue"),
		meta: {
			isLoginPage: true,
		},
		props: true,
	},
	{
		path: "/signup",
		name: "Signup",
		component: () => import("../views/Signup.vue"),
	},
	{
		path: "/forgot-password",
		name: "ForgotPassword",
		component: () => import("../views/ForgotPassword.vue"),
	},
	{
		path: "/reset-password",
		name: "ResetPassword",
		component: () => import("../views/ResetPassword.vue"),
	},
];
