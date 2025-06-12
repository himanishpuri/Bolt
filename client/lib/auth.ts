import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export interface TokenPayload {
  userId: number
  email: string
  role: string
  exp?: number
  iat?: number
}

export async function verifyToken(token: string): Promise<TokenPayload | null> {
  try {
    const payload = jwt.verify(token, JWT_SECRET) as TokenPayload
    return payload
  } catch (error) {
    return null
  }
}

export function generateToken(payload: Omit<TokenPayload, "exp" | "iat">, expiresIn = "24h"): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn })
}

export function decodeToken(token: string): TokenPayload | null {
  try {
    const decoded = jwt.decode(token) as TokenPayload
    return decoded
  } catch (error) {
    return null
  }
}

export function isTokenExpired(token: string): boolean {
  const decoded = decodeToken(token)
  if (!decoded || !decoded.exp) return true

  // exp is in seconds, Date.now() is in milliseconds
  return decoded.exp * 1000 < Date.now()
}
