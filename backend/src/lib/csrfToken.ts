import crypto from "crypto";
import { config } from "../config";

/** Signed CSRF tokens work without third-party cookies (fixes iOS Safari / Chrome). */
const CSRF_TTL_MS = 2 * 60 * 60 * 1000; // 2 hours

function secret() {
  return config.jwt.accessSecret;
}

export function signCsrfToken(): string {
  const ts = Date.now();
  const nonce = crypto.randomBytes(16).toString("hex");
  const payload = `${ts}:${nonce}`;
  const sig = crypto.createHmac("sha256", secret()).update(payload).digest("hex");
  return `${payload}:${sig}`;
}

export function verifyCsrfToken(token: string): boolean {
  const lastColon = token.lastIndexOf(":");
  if (lastColon <= 0) return false;
  const sig = token.slice(lastColon + 1);
  const payload = token.slice(0, lastColon);
  const parts = payload.split(":");
  if (parts.length !== 2) return false;
  const ts = Number(parts[0]);
  if (!Number.isFinite(ts) || Date.now() - ts > CSRF_TTL_MS) return false;

  const expected = crypto.createHmac("sha256", secret()).update(payload).digest("hex");
  if (sig.length !== expected.length) return false;
  try {
    return crypto.timingSafeEqual(Buffer.from(sig, "utf8"), Buffer.from(expected, "utf8"));
  } catch {
    return false;
  }
}
