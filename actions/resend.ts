"use server";
import { generateVerificationToken } from "@/lib/tokens";
import { getVerificationTokenByToken } from "@/data/verificationToken";
import { sendVerificationEmail } from "@/lib/mail";

// Function to resend verification token
export async function resendVerificationToken(token: string) {
    const ERROR_MESSAGE = 'An error occurred. Please try again later. If the problem persists, please contact support.';
    try {
        // Get the verification token from the database
        const existingToken = await getVerificationTokenByToken(token);
        if (!existingToken) {
            return { error: 'Invalid token' };
        }
        
        // Check if the existing token is expired
        const isExpired = existingToken.expiresAt < new Date();
        if (!isExpired) {
            return { error: 'Token is still valid.  Please use existing token.' };
        }

        const { email } = existingToken
        // Generate a new verification token
        const newToken = await generateVerificationToken(email);
        if (!newToken) {
            return { error: ERROR_MESSAGE };
        }
        // Send the new verification token to the user's email
        await sendVerificationEmail(email, newToken.token);

        return { success: 'Verification email resent' };
    } catch (error) {
        console.error('Error resending verification token:', error);
        return { error: ERROR_MESSAGE };
    }
}
