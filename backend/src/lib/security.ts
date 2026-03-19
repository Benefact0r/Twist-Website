import crypto from "crypto";

export const sha256 = (input: string) =>
  crypto.createHash("sha256").update(input).digest("hex");

export const generateCsrfToken = () => crypto.randomBytes(24).toString("hex");
