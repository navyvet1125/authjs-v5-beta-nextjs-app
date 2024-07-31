import { db } from "@/lib/db";

export const getTwoFactorTokenByToken = async (token: string) => {
    try {
        const twoFactorToken = await db.twoFactorToken.findUnique({
            where: { token },
        });
        return twoFactorToken;
    } 
    catch (error) {
        console.error("Error in getTwoFactorTokenByToken! ", error);
        return null;
    }
}

export const getTwoFactorTokenByEmail = async (email: string) => {
    try {
        const twoFactorToken = await db.twoFactorToken.findFirst({
            where: { email },
        });
        return twoFactorToken;
    } 
    catch (error) {
        console.error("Error in getTwoFactorTokenByEmail! ", error);
        return null;
    }
}

export const findAndDeleteTwoFactorTokenByToken = async (token: string) => {
    try {
        const twoFactorToken = await db.twoFactorToken.findUnique({
            where: { token },
        });
        if (!twoFactorToken) {
            return null;
        }
        await db.twoFactorToken.delete({
            where: { id: twoFactorToken.id },
        });
        return twoFactorToken;
    } 
    catch (error) {
        console.error("Error in findAndDeleteTwoFactorTokenByToken! ", error);
        return null;
    }
}