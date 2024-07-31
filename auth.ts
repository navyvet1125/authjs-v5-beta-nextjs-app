import NextAuth from "next-auth";
import { CustomPrismaAdapter } from "./prisma-adapter";
import { db } from "@/lib/db";
import authConfig from "@/auth.config";
import { UserRole } from "@prisma/client";
import { AdapterUser } from "next-auth/adapters";
import { getUserById } from "@/data/user";

import { 
  findAndDeleteTwoFactorTokenByToken,
  getTwoFactorTokenByEmail
} from "./data/twoFactorToken";

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

  callbacks: {
    async signIn({ user, account }) {
      // Ensure user object is defined
      if (!user) return false;

      // Allow sign in if account is not credentials
      if (account?.provider !== "credentials") return true;

      // Look up the user by ID in the database, return false if not found
      const dbUser = await getUserById(user.id!);
      if ( !dbUser ) return false;
      const { email } = dbUser;

      // Check if user has 2FA enabled only if using the "credentials" provider
      // If 2FA, collect data on and delete any existing token
      // return user to login if the token was expired
      if (dbUser?.isTwoFactorEnabled && account.type === "credentials") {
        try {
          const existingToken = await getTwoFactorTokenByEmail(user.email!);
          if (existingToken){
            const { token, expiresAt } = existingToken;
            const isExpired = new Date(expiresAt) < new Date();
            await findAndDeleteTwoFactorTokenByToken(token);
            if (isExpired) return '/auth/login?error=expired';
          
          }
          // Generate a new token and send the code to the user via email
          const twoFactorToken = await generateTwoFactorToken(email);
          await sendTwoFactorEmail(email, twoFactorToken!.token);

          // Redirect the user to the two factor login page with the session ID
          return `/auth/login?twoFactor=true?sessionId=${twoFactorToken!.sessionId}`;
  
        } catch (error) {
          console.error("Error in signIn! ", error);
          return false;
        }
    }
      
      return true;
    },
    async jwt({ token, user }) {
      // Add role and emailVerfied to the token
      if (!token.sub || !user) return token;
      token.role = (user as RoledUser).role;
      token.emailVerified = (user as RoledUser).emailVerified;
      return token;
    },
    async session({ session, token }) {
      // Add role, emailVerified, and user ID  to the session
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
