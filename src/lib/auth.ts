import { createHash, createHmac, timingSafeEqual } from "node:crypto";

const SESSION_COOKIE = "ream_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;
const SESSION_SECRET = import.meta.env.SUPABASE_JWT_SECRET;

type SessionPayload = {
  email: string;
  exp: number;
};

function signPayload(encodedPayload: string): string {
  return createHmac("sha256", SESSION_SECRET).update(encodedPayload).digest("base64url");
}

function encodePayload(payload: SessionPayload): string {
  return Buffer.from(JSON.stringify(payload), "utf-8").toString("base64url");
}

function decodePayload(encodedPayload: string): SessionPayload | null {
  try {
    const raw = Buffer.from(encodedPayload, "base64url").toString("utf-8");
    const data = JSON.parse(raw) as SessionPayload;
    if (!data.email || typeof data.exp !== "number") return null;
    return data;
  } catch {
    return null;
  }
}

export function hashPassword(plainPassword: string): string {
  return createHash("sha256").update(plainPassword).digest("hex");
}

export function createSessionToken(email: string): string {
  const payload: SessionPayload = {
    email,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  };
  const encodedPayload = encodePayload(payload);
  const signature = signPayload(encodedPayload);
  return `${encodedPayload}.${signature}`;
}

export function readSessionEmail(token: string | undefined): string | null {
  if (!token) return null;

  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) return null;

  const expectedSignature = signPayload(encodedPayload);
  if (signature.length !== expectedSignature.length) return null;
  if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) return null;

  const payload = decodePayload(encodedPayload);
  if (!payload) return null;
  if (payload.exp < Math.floor(Date.now() / 1000)) return null;

  return payload.email;
}

export function sessionCookieName(): string {
  return SESSION_COOKIE;
}

export function sessionMaxAgeSeconds(): number {
  return SESSION_TTL_SECONDS;
}
