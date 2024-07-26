import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export function CustomPrismaAdapter(p: PrismaClient) {
  return {
    ...PrismaAdapter(p),
    createUser: (data: any) => {
      return p.user.create({
        data: {
          ...data,
          role: data.role ?? "USER", // Add your custom field here
          id: data.id,
        },
      })
    },
    // Override other methods as needed
  }
}