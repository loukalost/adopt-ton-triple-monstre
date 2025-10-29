/**
 * Better Auth Configuration for CLI
 * This file is used by @better-auth/cli for schema generation
 * It contains the static configuration without database connection
 */
import { betterAuth } from 'better-auth'

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false
  },
  socialProviders: {
    github: {
      enabled: process.env.GITHUB_CLIENT_ID !== undefined && process.env.GITHUB_CLIENT_ID.length > 0,
      clientId: process.env.GITHUB_CLIENT_ID ?? '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? ''
    }
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24 // 1 day
  },
  advanced: {
    cookiePrefix: 'adopt-ton-triple-monstre'
  }
})

export default auth
