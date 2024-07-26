"use server";
import * as z from "zod";
import { ForgotSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import { sendPasswordResetEmail } from "@/lib/mail";
import { generatePasswordResetToken } from "@/lib/tokens";

export const forgot = async (values: z.infer<typeof ForgotSchema>) => {
    const ERROR_MESSAGE = "If the email exists, a reset link will be sent.";
    try {
        const validatedFields = ForgotSchema.safeParse(values);
       if (!validatedFields.success) {
            return {
                error: "Invalid email",
            };
        } 
        const { email } = validatedFields.data;   
        const existingUser = await getUserByEmail(email);

        if (!existingUser) {
            return {
                success: ERROR_MESSAGE,
            };
        }
        if (existingUser.emailVerified === null) {
            return {
                success: ERROR_MESSAGE,
            };
        }
        if (!existingUser.password) {
            return {
                error: "Password reset not allowed for social login accounts",
            };
        }
        const passwordResetToken = await generatePasswordResetToken(email);
        if (!passwordResetToken) {
            return {
                error: "An error occurred",
            };
        }
        await sendPasswordResetEmail(passwordResetToken.email, passwordResetToken.token);

        return { success: ERROR_MESSAGE };
    } catch (error) {
        console.error("Error in forgot action! ", error);
        return {
            error: "An error occurred",
        };
    }
}
