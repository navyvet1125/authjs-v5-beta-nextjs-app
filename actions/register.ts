"use server";
import * as z from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

import { RegisterSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
    const ERROR_MESSAGE = "An error occurred, please try again later.  If the problem persists, please contact support.";
    try{

    const validatedFields = RegisterSchema.safeParse(values);

    if (!validatedFields.success) {
        return {
            error: validatedFields.error?.errors.toString() || "An error occurred",
        };
    }

    const {email, password, name} = validatedFields.data;
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await getUserByEmail(email);

    if (existingUser) {
        return {
            error: "Email already in use",
        };
    }

    await db.user.create({
        data: {
            email,
            password: hashedPassword,
            name,

        },
    });

    const verificationToken = await generateVerificationToken(email);
    if (!verificationToken) {
        return {
            error: ERROR_MESSAGE,
        };
    }
    await sendVerificationEmail(email, verificationToken.token);

    return {success: "Confirmation email sent!"};
    } catch (error) {
        console.error("Error in register! ", error);
        return {
            error: ERROR_MESSAGE,
        };
    }
}