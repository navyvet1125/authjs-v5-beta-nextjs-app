"use server";

import { db } from "@/lib/db";
import { getUserByEmail } from "@/data/user";
import { getVerificationTokenByToken } from "@/data/verificationToken";
// import { generateVerificationToken } from "@/lib/tokens";
// import { sendVerificationEmail } from "@/lib/mail";

export const newVerification = async (token: string) => {
    try{
        const existingToken = await getVerificationTokenByToken(token);
        if (!existingToken) {
            return {
                error: "Invalid token",
            };
        }
        const existingUser = await getUserByEmail(existingToken.email);
        if (!existingUser) {
            return {
                error: "User not found",
            };
        }
        if(existingUser.emailVerified){
            return {
                error: "Email already verified",
            };
        }

        const isExpired = existingToken.expiresAt < new Date();
        if (isExpired) {
            return {
                error: "Token expired",
            };
        }
        // update user email and emailVerified.
        // Email is included in case user changed email before verifying,
        // or if we want to update and verify email in the future.
        await db.user.update({
            where: { id: existingUser.id },
            data: { 
                emailVerified: new Date(),
                email: existingToken.email,
             },
        });
        // delete verification token
        await db.verificationToken.delete({
            where: { id: existingToken.id },
        });

        return {success: "Email verified!"};

    } catch (error) {
        console.error("Error in newVerification! ", error);
        return {
            error: "An error occurred",
        };
    }
}