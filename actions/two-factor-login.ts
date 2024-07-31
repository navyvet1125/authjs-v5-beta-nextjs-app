"use server";
import * as z from "zod";
// import { NextResponse } from "next/server";

import { signIn } from "@/auth";
import { TwoFactorSchema } from "@/schemas";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { getUserByEmail } from "@/data/user";
import { generateTwoFactorToken } from "@/lib/tokens";
import { sendTwoFactorEmail } from "@/lib/mail";
import { findAndDeleteTwoFactorTokenByToken, getTwoFactorTokenByToken } from "@/data/twoFactorToken";
// import { redirect } from "next/dist/server/api-utils";

export const twoFactorLogin = async (values: z.infer<typeof TwoFactorSchema>) => {
    const validatedFields = TwoFactorSchema.safeParse(values);

    if (!validatedFields.success) {
        return {
            error: "Invalid fields",
        };
    }

    const { token, email } = validatedFields.data;
    try {
        const existingToken = await getTwoFactorTokenByToken(token);
        if (!existingToken) {
            return {
                error: "Invalid token",
            };
        }

        const isExpired = new Date(existingToken.expiresAt) < new Date();
        if (isExpired) {
            findAndDeleteTwoFactorTokenByToken(token);
            return {
                error: "Token expired",
            };
        }

        await signIn("twoFactor", {
            token,
            email,
            redirectTo: DEFAULT_LOGIN_REDIRECT,
        });
        return { success: "Logged in" };

    } catch (error) {
        if (error instanceof AuthError){
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Invalid credentials" };
                case "AccessDenied":
                    return { error: "Access denied" };
                default:
                    return { error: "Unknown error" };
            }
        } 
        throw error;
    }

}