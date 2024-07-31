import crypto from 'crypto';
import { db } from '@/lib/db';
import { getVerificationTokenByEmail } from '@/data/verificationToken';
import { getPasswordResetTokenByEmail } from '@/data/passwordResetToken';
import { 
    getTwoFactorTokenByEmail,
    findAndDeleteTwoFactorTokenByToken
} from '@/data/twoFactorToken';

export const generateTwoFactorToken = async (email: string) => {
    const token = crypto.randomInt(100000, 999999).toString(); // Generate a random 6-digit token
    const sessionId = crypto.randomUUID(); // Generate a random session ID
    const expiresAt = new Date(new Date().getTime() + 1000 * 60 * 5 ); // 5 minute expiration
    const existingToken = await getTwoFactorTokenByEmail(email); // Check if a token already exists for the email
    try {
        // If a token already exists, delete it
        if (existingToken) {
            await findAndDeleteTwoFactorTokenByToken(existingToken.token);
        }
  
        // Create and return a new two-factor token
        const twoFactorToken = await db.twoFactorToken.create({
            data: {
                email,
                token,
                sessionId,
                expiresAt,
            },
        });
        return twoFactorToken;

    } catch (error) {
        console.error("Error in generateTwoFactorToken! ", error);
        return null;
    }
};

export const generateVerificationToken = async (email: string) => {
    const token = crypto.randomUUID(); // Generate a random token
    const expiresAt = new Date(new Date().getTime() + 1000 * 60 * 60 ); // 1 hour expiration
    const existingToken = await getVerificationTokenByEmail(email); // Check if a token already exists for the email
    try {
        // If a token already exists, delete it
        if (existingToken) {
            await db.verificationToken.delete({
                where: {
                    id: existingToken.id,
                },
            });
        }
        // Create and return a new verification token
        const verificationToken = await db.verificationToken.create({
            data: {
                email,
                token,
                expiresAt,
            },
        });
        return verificationToken;

    } catch (error) {
        console.error("Error in generateVerificationToken! ", error);
        return null;
    }

};

export const generatePasswordResetToken = async (email: string) => {
    const token = crypto.randomUUID(); // Generate a random token
    const expiresAt = new Date(new Date().getTime() + 1000 * 60 * 60 ); // 1 hour expiration
    const existingToken = await getPasswordResetTokenByEmail(email); // Check if a token already exists for the email
    try {
        // If a token already exists, delete it
        if (existingToken) {
            await db.passwordResetToken.delete({
                where: {
                    id: existingToken.id,
                },
            });
        }
        // Create and return a new password reset token
        const passwordResetToken = await db.passwordResetToken.create({
            data: {
                email,
                token,
                expiresAt,
            },
        });
        return passwordResetToken;

    } catch (error) {
        console.error("Error in generatePasswordResetToken! ", error);
        return null;
    }

};