import { newPassword } from './new-password';
"use server";

import * as z from "zod";
import bcrypt  from 'bcryptjs';
import { db } from "@/lib/db";
import { SettingsSchema } from "@/schemas";
import { getUserById } from "@/data/user";
import { currentUser } from "@/lib/auth";
import { auth, unstable_update } from "@/auth"
import { generateVerificationToken } from '@/lib/tokens';
import { sendVerificationEmail } from '@/lib/mail';
// import { getServerSession } from "next-auth"

interface ChangeFields {
    isOauth?: boolean;
    role?: "ADMIN" | "USER";
    name?: string;
    email?: string;
    isTwoFactorEnabled?: boolean;
    password?: string;
    newPassword?: string;
    emailVerified?: Date | null; // Add this line
}
export const settings = async (values:z.infer<typeof SettingsSchema>) => {
    try {
    const validatedFields = SettingsSchema.safeParse(values);
    if (!validatedFields.success) {
        return { error: "Invalid values!" };
    }
    const {isOauth, ...changeFields} = validatedFields.data as ChangeFields;

    
    // Make sure the user is authenticated
    const user = await currentUser();
    if (!user || !user.id) {
        return { error: "Not authenticated" };
    }

    // Make sure the user exists
    const dbUser = await getUserById(user.id);
    if (!dbUser) {
        return { error: "User not found" };
    }

    // Check if the password is correct
    if(changeFields.password) {
        if(isOauth || !dbUser.password) return { error: "No password set" };
        const isMatch = await bcrypt.compare(changeFields.password, dbUser.password);
        if (!isMatch) {
            return { error: "Password is incorrect" };
        }
        if (!changeFields.newPassword) {
            return { error: "New password required" };
        }
        changeFields.password = await bcrypt.hash(changeFields.newPassword, 10);
        changeFields.newPassword = undefined;
    }

    // Check if the new email is already in use
    if (changeFields.email) {
        const existingUser = await db.user.findUnique({
            where: { email: changeFields.email }
        });
        if (existingUser) {
            return { error: "Email already in use" };
        }
        changeFields.emailVerified = null;
    }
    const { newPassword, ...updateFields } = changeFields;
    await db.user.update({
        where: { id: dbUser.id },
        data: {...updateFields},
    });

    // Update the user in the session on the server to reflect the changes
    await unstable_update({ user: {...dbUser, ...updateFields }});
    console.log("Updated user in session");

    // if the email was changed, generate a verification token and send an email
    if (changeFields.email) {
        const token = await generateVerificationToken(changeFields.email);
        if (!token) {
            return { error: "Error generating verification token" };
        }
        await sendVerificationEmail(changeFields.email, token.token);

        return { success: "Settings updated. Verification email sent", values:{...updateFields} };
    }

    return { success: "Settings updated", values:{...updateFields} };

    } catch (error) {
        console.error("Error in settings action: ", error);
        return { error: "Server Error" };
    }
};