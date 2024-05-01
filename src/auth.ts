import NextAuth from "next-auth"
import GitHub from "@auth/core/providers/github"
import Discord from "@auth/core/providers/discord"
import { db } from "./lib/utils/prisma"
import { PrismaAdapter } from "@auth/prisma-adapter";

export const { auth, handlers } = NextAuth({
  pages: {
    signIn: "/",
    signOut: "/",
    error: "/",
    verifyRequest: "/",
  },
  providers: [
    GitHub,
    Discord
  ],
  adapter: PrismaAdapter(db)
})
