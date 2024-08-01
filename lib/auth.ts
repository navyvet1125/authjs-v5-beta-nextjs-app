import { auth } from "@/auth";

// Allows you to get the current user from the session
// This is a simple wrapper around the auth function
// For server side use only

export const currentUser = async () => {
    const session = await auth();
    return session?.user;
};