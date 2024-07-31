import { useSession } from "next-auth/react";

// Custom hook to get the current user
// This is a simple wrapper around the useSession hook
// that returns the user object from the session
// This hook must be used in a component wrapped in a SessionProvider

export const useCurrentUser = () => {
    const session = useSession();
    return session.data?.user;
};