import { auth } from "@/auth";
// These are simple wrappers around the auth function
// For server side use only


// Allows you to get the current user from the session
export const currentUser = async () => {
    const session = await auth();
    return session?.user;
};

// Allows you to get the current user role from the session
export const currentUserRole = async () => {
    const session = await auth();
    return session?.user?.role;
}