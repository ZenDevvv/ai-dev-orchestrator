export const API_ENDPOINTS = {
	BASE_URL: import.meta.env.VITE_BASE_URL || "http://localhost:3000/api",

	// Auth API endpoints
	AUTH: {
		LOGIN: "/auth/login",
		LOGOUT: "/auth/logout",
		REGISTER: "/auth/register",
	},

	// User API endpoints
	USER: {
		GET_ALL: "/user",
		GET_BY_ID: "/user/:id",
		GET_CURRENT: "/user/current",
		CREATE: "/user",
		UPDATE: "/user/:id",
		DELETE: "/user/:id", // Soft delete
	},

	// Person API endpoints
	PERSON: {
		GET_ALL: "/person",
		GET_BY_ID: "/person/:id",
		CREATE: "/person",
		UPDATE: "/person/:id",
		DELETE: "/person/:id", // Soft delete
	},

	PRODUCT: {
		GET_ALL: "/product",
		GET_BY_ID: "/product/:id",
		CREATE: "/product",
		UPDATE: "/product/:id",
		DELETE: "/product/:id", // Soft delete
	},

	CATEGORY: {
		GET_ALL: "/category",
		GET_BY_ID: "/category/:id",
		CREATE: "/category",
		UPDATE: "/category/:id",
		DELETE: "/category/:id", // Soft delete
	},

	PRODUCT_TYPE: {
		GET_ALL: "/product-type",
		GET_BY_ID: "/product-type/:id",
		CREATE: "/product-type",
		UPDATE: "/product-type/:id",
		DELETE: "/product-type/:id", // Soft delete
	},


	BATCH: {
		GET_ALL: "/batch",
		GET_BY_ID: "/batch/:id",
		CREATE: "/batch",
		UPDATE: "/batch/:id",
		DELETE: "/batch/:id", // Soft delete
	},

	SUPPLIER: {
		GET_ALL: "/supplier",
		GET_BY_ID: "/supplier/:id",
		CREATE: "/supplier",
		UPDATE: "/supplier/:id",
		DELETE: "/supplier/:id", // Soft delete
	},

	SUPPLIER_ITEM: {
		GET_ALL: "/supplier-item",
		GET_BY_ID: "/supplier-item/:id",
		CREATE: "/supplier-item",
		UPDATE: "/supplier-item/:id",
		DELETE: "/supplier-item/:id", // Soft delete
	},

	ORGANIZATION: {
		GET_ALL: "/organization",
		GET_BY_ID: "/organization/:id",
		CREATE: "/organization",
		UPDATE: "/organization/:id",
		DELETE: "/organization/:id", // Soft delete
	},

	STOCK_ITEM: {
		GET_ALL: "/stock-item",
		GET_BY_ID: "/stock-item/:id",
		CREATE: "/stock-item",
		UPDATE: "/stock-item/:id",
		DELETE: "/stock-item/:id", // Soft delete
	},

	STOCK_RECORD: {
		GET_ALL: "/stock-record",
		GET_BY_ID: "/stock-record/:id",
		CREATE: "/stock-record",
		UPDATE: "/stock-record/:id",
		DELETE: "/stock-record/:id", // Soft delete
	},
};
