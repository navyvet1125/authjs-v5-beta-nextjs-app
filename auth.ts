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
  emailVerified: Date | null;
  isTwoFactorEnabled: boolean;
  isOauth: boolean;
}

export const { handlers, signIn, signOut, auth, unstable_update } = NextAuth({
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
    async jwt({ token, user, session, account }) {
      // User is only defined on sign in
      // Session is only defined on refresh

      // If session was refreshed, update token
      if (session) {
        const {name, email, role, emailVerified, isTwoFactorEnabled} = session.user;
        console.log("Session refreshed for user: ", role, name, email);
        token.name = name;
        token.email = email;
        token.role = role;
        token.emailVerified = emailVerified;
        token.isTwoFactorEnabled = isTwoFactorEnabled;
      }

      // if user is defined, add extended user info to the token
      // RoledUser is used to extend user with role, emailVerified, and isTwoFactorEnabled
      if (user) {
        console.log("User signed in");
        token.sub = user.id;
        token.role = (user as RoledUser).role;
        token.emailVerified = (user as RoledUser).emailVerified;
        token.isTwoFactorEnabled = (user as RoledUser).isTwoFactorEnabled;
        token.isOauth = account?.type === "oauth";
      }
      return token;
    },
    async session({ session, token }) {
      // Add role, emailVerified, and user ID  to the session
      if(token.role) {
        session.user.role = token.role as UserRole;
        session.user.emailVerified = token.emailVerified as Date | null;
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
        session.user.isOauth = token.isOauth as boolean;
      }
      if(token.sub) session.user.id = token.sub;
      return session;
    },
  },
  adapter: CustomPrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
