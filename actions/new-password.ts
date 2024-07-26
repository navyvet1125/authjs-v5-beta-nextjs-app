"use server";
import * as z from "zod";
import bcrypt from "bcryptjs";
import { NewPasswordSchema } from "@/schemas";
import { getPasswordResetTokenByToken } from "@/data/passwordResetToken";
import { getUserByEmail } from "@/data/user";
import { db } from "@/lib/db";

export const newPassword = async (
    values: z.infer<typeof NewPasswordSchema>,
    token?: string | null
) => {
    try {
        if (!token) {
            return {
                error: "Missing token",
            };
        }
        const validatedFields = NewPasswordSchema.safeParse(values);
        if (!validatedFields.success) {
            return {
                error: "Invalid password",
            };
        }
        const { password } = validatedFields.data;
        const existingToken = await getPasswordResetTokenByToken(token);
        if (!existingToken) {
            return {
                error: "Invalid token",
            };
        }
        const isExpired = new Date (existingToken.expiresAt) < new Date();
        if (isExpired) {
            return {
                error: "Token expired",
            };
        }
        const existingUser = await getUserByEmail(existingToken.email);
        
        if (!existingUser) {
            return {
                error: "User email not found",
            };
        }
        
        const matchingPassword = await bcrypt.compare(password, existingUser.password!);
        if (matchingPassword) {
            return {
                error: "Password cannot be the same as the current password",
            };
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        await db.user.update({
            where: { id: existingUser.id },
            data: { password: hashedPassword },
        });

        await db.passwordResetToken.delete({
            where: { id: existingToken.id },
        });

        return {
            success: "Password updated",
        };
    } catch (error) {
        console.error("Error in newPassword action! ", error);
        return {
            error: "An error occurred",
        };
    }
}