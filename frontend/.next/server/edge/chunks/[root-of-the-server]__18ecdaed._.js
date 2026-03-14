(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["chunks/[root-of-the-server]__18ecdaed._.js", {

"[externals]/node:buffer [external] (node:buffer, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)": ((__turbopack_context__) => {

var { m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}}),
"[project]/src/constants/cookies.ts [middleware-edge] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "COOKIE_KEYS": ()=>COOKIE_KEYS,
    "COOKIE_OPTIONS": ()=>COOKIE_OPTIONS
});
const COOKIE_KEYS = {
    AUTH_TOKEN: 'auth_token',
    USER_INFO: 'user_info'
};
const COOKIE_OPTIONS = {};
}),
"[project]/src/constants/routes.ts [middleware-edge] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "ROUTES": ()=>ROUTES
});
const ROUTES = {
    HOMEPAGE: '/',
    LOGIN: '/login',
    ADMIN: {
        DASHBOARD: '/admin',
        INVENTORY: '/admin/inventory'
    }
};
}),
"[project]/src/middleware.ts [middleware-edge] (ecmascript)": ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s({
    "config": ()=>config,
    "middleware": ()=>middleware
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/api/server.js [middleware-edge] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/server/web/spec-extension/response.js [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$cookies$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/constants/cookies.ts [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$routes$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/constants/routes.ts [middleware-edge] (ecmascript)");
;
;
;
function middleware(req) {
    const token = req.cookies.get(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$cookies$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["COOKIE_KEYS"].AUTH_TOKEN)?.value;
    const { pathname } = req.nextUrl;
    if (token && pathname === __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$routes$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["ROUTES"].LOGIN) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$routes$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["ROUTES"].ADMIN.DASHBOARD, req.url));
    }
    if (!token && pathname !== __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$routes$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["ROUTES"].LOGIN) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$constants$2f$routes$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["ROUTES"].LOGIN, req.url));
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
}
const config = {
    matcher: [
        '/',
        '/login',
        '/admin/:path*'
    ]
};
}),
}]);

//# sourceMappingURL=%5Broot-of-the-server%5D__18ecdaed._.js.map