import { JWT } from 'next-auth/jwt';
import NextAuth, {type DefaultSession} from "next-auth";
import { UserRole } from '@prisma/client';
import { JWT } from "@auth/core/JWT";

export type ExtendedUser = DefaultSession["user"] & {
  role: UserRole;
  emailVerified: Date | null;
  isTwoFactorEnabled: boolean;
  // accountType: string;
  isOauth: boolean;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}