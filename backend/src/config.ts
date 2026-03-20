import dotenv from "dotenv";

dotenv.config();

const parseBool = (value: string | undefined, fallback: boolean) => {
  if (value === undefined) return fallback;
  return value === "true" || value === "1";
};

export const config = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 4000),
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:8080",
  databaseUrl: process.env.DATABASE_URL || "",
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || "dev-access-secret",
    refreshSecret: process.env.JWT_REFRESH_SECRET || "dev-refresh-secret",
    accessTtl: process.env.JWT_ACCESS_TTL || "15m",
    refreshTtlDays: Number(process.env.JWT_REFRESH_TTL_DAYS || 30),
  },
  cookieSecure: parseBool(process.env.COOKIE_SECURE, false),
  gcs: {
    projectId: process.env.GCS_PROJECT_ID || "",
    bucket: process.env.GCS_BUCKET || "",
  },
  smtp: {
    host: process.env.SMTP_HOST || "",
    port: Number(process.env.SMTP_PORT || 587),
    secure: parseBool(process.env.SMTP_SECURE, false),
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
    from: process.env.MAIL_FROM || "",
  },
};

export const isProduction = config.nodeEnv === "production";
