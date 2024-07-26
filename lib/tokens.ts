import { v4 as uuidv4 } from 'uuid';
import { db } from '@/lib/db';
import { getVerificationTokenByEmail } from '@/data/verificationToken';

export const generateVerificationToken = async (email: string) => {
    const token = uuidv4(); // Generate a random token
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