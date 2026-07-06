import { prisma } from './prisma'

const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

export async function rateLimit(
  identifier: string,
  maxRequests: number = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  windowMs: number = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000')
): Promise<{ success: boolean; remaining: number }> {
  const now = Date.now()
  const record = rateLimitStore.get(identifier)

  if (!record || now > record.resetTime) {
    rateLimitStore.set(identifier, { count: 1, resetTime: now + windowMs })
    return { success: true, remaining: maxRequests - 1 }
  }

  if (record.count >= maxRequests) {
    return { success: false, remaining: 0 }
  }

  record.count++
  return { success: true, remaining: maxRequests - record.count }
}

export function getRateLimitKey(ip: string, route: string): string {
  return `${ip}:${route}`
}
