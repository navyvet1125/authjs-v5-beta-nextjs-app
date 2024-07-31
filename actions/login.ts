"use server";
import * as z from "zod";
// import { NextResponse } from "next/server";

import { signIn } from "@/auth";
import { LoginSchema } from "@/schemas";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { getUserByEmail } from "@/data/user";
import { generateTwoFactorToken } from "@/lib/tokens";
import { sendTwoFactorEmail } from "@/lib/mail";
import { findAndDeleteTwoFactorTokenByToken, getTwoFactorTokenByToken } from "@/data/twoFactorToken";
import { redirect } from "next/dist/server/api-utils";

export const login = async (values: z.infer<typeof LoginSchema>) => {
    const validatedFields = LoginSchema.safeParse(values);

    if (!validatedFields.success) {
        return {
            error: "Invalid fields",
        };
    }

    const { email, password } = validatedFields.data;

    try {
        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
            // redirectTo: DEFAULT_LOGIN_REDIRECT,
        });
        if (result.includes("twoFactor=true")) {
            const sessionId = result.split("sessionId=")[1];
            return {
                success: "Two factor token sent", 
                twoFactor: true,
                sessionId,
        };
        } else if (result.includes("error=expired")) {
            return { 
                error: "Token expired"
            };
        } else {
            return {
                success: "Logged in",
                redirectTo: DEFAULT_LOGIN_REDIRECT,
            };
        }

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