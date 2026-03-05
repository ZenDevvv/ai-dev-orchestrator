import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

const authRoutes: RouteConfig = [route("/login", "routes/auth/login.tsx")];
const adminRoutes: RouteConfig = [];

export default [
	index("routes/landing.tsx"),
	layout("layouts/auth-layout.tsx", authRoutes),
	...(adminRoutes.length > 0 ? [layout("layouts/admin-layout.tsx", adminRoutes)] : []),
] satisfies RouteConfig;
