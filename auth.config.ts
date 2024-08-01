import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import bcrypt from "bcryptjs"
import { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"

import { LoginSchema } from "@/schemas"
import { getUserByEmail } from "@/data/user";
import { 
    findAndDeleteTwoFactorTokenByToken,
    getTwoFactorTokenByToken,
    getTwoFactorTokenByTokenAndSessionId
} from "@/data/twoFactorToken"

import { UUID } from "crypto"

export default {
    useSecureCookies: process.env.NODE_ENV === 'production',
    providers: [
        GitHub,
        Google,
        Credentials({
            id: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                try{
                    const validatedFields = LoginSchema.safeParse(credentials);

                    if (validatedFields.success) {
                        const { email, password } = validatedFields.data;
                        
                        const user = await getUserByEmail(email);
                        if (!user || !user.password) return null;
                        
    
                        const isValid = await bcrypt.compare(password, user.password);
                        if (isValid) return user;
                    }
                    return null;
    
                } catch (error) {
                    console.error("Error in authorize callback! ", error);
                    return null;
                }
            }
        }),
        Credentials({
            id: "twoFactor",
            credentials: {
                token: { label: "Token", type: "text" },
                email: { label: "email", type: "text" },
                sessionId: { label: "Session ID", type: "text" }
            },
            async authorize(credentials) {
                try {
                    // Get the token and sessionId from the credentials
                    const { token, email, sessionId } = credentials as { token: string, email: string, sessionId: UUID };
                    // Get the two factor token by token and sessionId
                    const twoFactorToken = await getTwoFactorTokenByTokenAndSessionId(token, sessionId);

                    // If the token is not found, return null
                    if (!twoFactorToken ) return null;

                    // Check if the token is expired, if it is, delete it and return null
                    const isExpired = (new Date(twoFactorToken.expiresAt) < new Date())
                    if (isExpired) {
                        findAndDeleteTwoFactorTokenByToken(token);
                        return null;
                    }

                    // Delete the token
                    findAndDeleteTwoFactorTokenByToken(token);

                    // Get the user by email
                    const user = await getUserByEmail(twoFactorToken.email) || null;

                    return user;
                } catch (error) {
                    console.error("Error in twoFactor authorize callback! ", error);
                    return null;
                }
            }
        })
    ] 
} satisfies NextAuthConfig