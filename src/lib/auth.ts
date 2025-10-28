import { betterAuth, type BetterAuthOptions } from 'better-auth'
import { mongodbAdapter } from 'better-auth/adapters/mongodb'
import { getAuthDb, getAuthClient } from '@/db'

// Lazy initialization of Better Auth
// This allows async database connection to be established before creating auth instance
let authInstance: ReturnType<typeof betterAuth> | null = null

async function getAuthInstance (): Promise<ReturnType<typeof betterAuth>> {
  if (authInstance !== null) {
    return authInstance
  }

  const db = await getAuthDb()
  const client = await getAuthClient()

  authInstance = betterAuth({
    database: mongodbAdapter(db, { client }),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false
    },
    socialProviders: {
      github: {
        enabled: process.env.GITHUB_CLIENT_ID !== undefined && process.env.GITHUB_CLIENT_ID.length > 0,
        clientId: process.env.GITHUB_CLIENT_ID as string,
        clientSecret: process.env.GITHUB_CLIENT_SECRET as string
      }
    },
    session: {
      expiresIn: 60 * 60 * 24 * 7, // 7 days
      updateAge: 60 * 60 * 24 // 1 day
    },
    advanced: {
      cookiePrefix: 'tamagotcho'
    }
  })

  return authInstance
}

// For CLI and static analysis, export a config object
// CLI can read this config without executing async code
export const authConfig: BetterAuthOptions = {
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false
  },
  socialProviders: {
    github: {
      enabled: process.env.GITHUB_CLIENT_ID !== undefined && process.env.GITHUB_CLIENT_ID.length > 0,
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string
    }
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24
  },
  advanced: {
    cookiePrefix: 'tamagotcho'
  }
}

// Export async function for API routes
export { getAuthInstance }

// For type inference
export type Session = Awaited<ReturnType<typeof getAuthInstance>> extends ReturnType<typeof betterAuth>
  ? ReturnType<typeof betterAuth>['$Infer']['Session']['session']
  : never
