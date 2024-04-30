import { env } from "@/lib/env.mjs"
import NextAuth from "next-auth"
import GitHub from "@auth/core/providers/github"
import { db } from "./lib/utils/prisma"
import { PrismaAdapter } from "@auth/prisma-adapter";

export const { auth, handlers } = NextAuth({
  providers: [
    GitHub({
      clientId: env.AUTH_GITHUB_CLIENT_ID,
      clientSecret: env.AUTH_GITHUB_CLIENT_SECRET
    })
  ],
  adapter: PrismaAdapter(db)
})
