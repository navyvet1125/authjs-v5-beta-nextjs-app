import NextAuth from "next-auth";
// import { PrismaAdapter } from "@auth/prisma-adapter";
import { CustomPrismaAdapter } from "./prisma-adapter";
import { db } from "@/lib/db";
import authConfig from "@/auth.config";
import { UserRole } from "@prisma/client";
import { AdapterUser } from "next-auth/adapters";
import { getUserById } from "@/data/user";

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
  events: {
    async linkAccount({ user }) {
      if (!user || !user.email) return;
      const ADMIN_USERS = process.env.ADMIN_USERS?.split(", ") || [];
      let role: UserRole = "USER";
      ADMIN_USERS?.includes(user.email)? role = "ADMIN" : role = "USER";
        
      await db.user.update({
        where: { id: user.id },
        data: { 
          emailVerified: new Date(),
          role
        },
      });
    }
  },
  callbacks: {
    async signIn({ user, account, email }) {
      // Ensure user object is defined
      if (!user) return false;

      // Allow sign in if account is not credentials
      if (account?.provider !== "credentials") return true;

      // Ensure email is verified, reject sign in if not
      const existingUser = await getUserById(user.id!);
      if ( !existingUser?.emailVerified ) return false;
      
      return true;
    },
    async jwt({ token, user }) {
      if (!token.sub || !user) return token;
      token.role = (user as RoledUser).role;
      return token;
    },
    async session({ session, token }) {
      if(token.role) session.user.role = token.role as UserRole;
      if(token.sub) session.user.id = token.sub;
      return session;
    },
  },
  adapter: CustomPrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
