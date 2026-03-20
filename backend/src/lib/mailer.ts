import nodemailer from "nodemailer";
import { config } from "../config";

const isMailConfigured = () =>
  Boolean(config.smtp.host && config.smtp.user && config.smtp.pass && config.smtp.from);

export const canSendMail = () => isMailConfigured();

export const sendPasswordResetEmail = async (to: string, resetUrl: string) => {
  if (!isMailConfigured()) return false;

  const transporter = nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: config.smtp.secure,
    auth: {
      user: config.smtp.user,
      pass: config.smtp.pass,
    },
  });

  await transporter.sendMail({
    from: config.smtp.from,
    to,
    subject: "Reset your Twist password",
    text: `Use this link to reset your password: ${resetUrl}\n\nIf you did not request this, you can safely ignore this email.`,
    html: `<p>Use this link to reset your password:</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>If you did not request this, you can safely ignore this email.</p>`,
  });

  return true;
};
