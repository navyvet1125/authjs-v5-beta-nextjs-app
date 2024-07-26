import { auth } from '@/auth';
// An array of public routes that don't require authentication
// @Type {String[]}
export const publicRoutes = [
    "/",
    "/auth/new-verification",
];

// An array of routes that are used for authentication
// These routes will redirect logged in users to protected routes
// @Type {String[]}
export const authRoutes = [
    "/auth/login",
    "/auth/register",
    "/auth/error",
    "/auth/reset",
    "/auth/new-password",
];

// The prefix for the authentication API routes
// Routes that start with this prefix will be handled by the auth.ts file
// @Type {String}
export const apiAuthPrefix = "/api/auth";

// Default redirect path after login
// @Type {String}
export const DEFAULT_LOGIN_REDIRECT = "/settings";