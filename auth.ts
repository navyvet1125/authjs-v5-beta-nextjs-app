import NextAuth, { User } from "next-auth";
// import { PrismaAdapter } from "@auth/prisma-adapter";
import { CustomPrismaAdapter } from "./prisma-adapter";
import { db } from "@/lib/db";
import authConfig from "@/auth.config";
import { UserRole } from "@prisma/client";
import { AdapterUser } from "next-auth/adapters";
import { getUserById } from "@/data/user";
// import { getTwoFactorConfirmationByUserId } from "@/data/twoFactorConfirmation";
import { findAndDeleteTwoFactorTokenByToken, getTwoFactorTokenByEmail } from "./data/twoFactorToken";
import { generateTwoFactorToken } from "@/lib/tokens";
import { sendTwoFactorEmail } from "@/lib/mail";

interface RoledUser extends AdapterUser {
  role: UserRole;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/auth/login",
    // signOut: "/auth/logout",
    error: "/auth/error",
    // verifyRequest: "/auth/verify",
    // newUser: "/auth/register",
  },
  // events: {
  //   async linkAccount({ user }) {
  //     if (!user || !user.email) return;
  //     const ADMIN_USERS = process.env.ADMIN_USERS?.split(", ") || [];
  //     let role: UserRole = "USER";
  //     ADMIN_USERS?.includes(user.email)? role = "ADMIN" : role = "USER";
        
  //     await db.user.update({
  //       where: { id: user.id },
  //       data: { 
  //         emailVerified: new Date(),
  //         role
  //       },
  //     });
  //   }
  // },
  callbacks: {
    async signIn({ user, account, email }) {
      // Ensure user object is defined
      if (!user) return false;

      // Allow sign in if account is not credentials
      if (account?.provider !== "credentials") return true;

      
      const existingUser = await getUserById(user.id!);
      if ( !existingUser ) return false;

      // Check if user has 2FA enabled only if using the "credentials" provider
      if (existingUser?.isTwoFactorEnabled && account.type === "credentials") {
        try {
          const existingToken = await getTwoFactorTokenByEmail(user.email!);
          if (!existingToken){
          const twoFactorToken = await generateTwoFactorToken(existingUser.email);
            await sendTwoFactorEmail(existingUser.email, twoFactorToken!.token);
            return `/auth/login?twoFactor=true`;
          }
          if (new Date(existingToken.expiresAt) < new Date()){
            findAndDeleteTwoFactorTokenByToken(existingToken.token);
            return '/auth/login?error=expired';
          }
          return `/auth/login?twoFactor=true`;
        } catch (error) {
          console.error("Error in signIn! ", error);
          return false;
        }
    }
      
      return true;
    },
    async jwt({ token, user, account }) {
      if (!token.sub || !user) return token;
      token.role = (user as RoledUser).role;
      token.emailVerified = (user as RoledUser).emailVerified;
      return token;
    },
    async session({ session, token }) {
      if(token.role) session.user.role = token.role as UserRole;
      if(token.emailVerified) session.user.emailVerified = token.emailVerified as Date | null;
      if(token.sub) session.user.id = token.sub;
      return session;
    },
  },
  adapter: CustomPrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
