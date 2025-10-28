import { getAuthInstance } from '@/lib/auth'
import { toNextJsHandler } from 'better-auth/next-js'
import type { NextRequest } from 'next/server'

// Create handlers that resolve auth instance at runtime
export async function POST (req: NextRequest): Promise<Response> {
  const auth = await getAuthInstance()
  const handler = toNextJsHandler(auth)
  return await handler.POST(req)
}

export async function GET (req: NextRequest): Promise<Response> {
  const auth = await getAuthInstance()
  const handler = toNextJsHandler(auth)
  return await handler.GET(req)
}
