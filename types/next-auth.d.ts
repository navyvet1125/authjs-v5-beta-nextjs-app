import { JWT } from 'next-auth/jwt';
import NextAuth, {type DefaultSession} from "next-auth";
import { UserRoleSchema } from "@/schemas";
import { UserRole } from '@prisma/client';
import { JWT } from "@auth/core/JWT";

export type ExtendedUser = DefaultSession["user"] & {
  role: UserRole;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}