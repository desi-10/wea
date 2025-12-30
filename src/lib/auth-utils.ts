import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

export const hashPassword = async (password: string) => {
  const salt = randomBytes(16).toString("hex");
  const hashedPassword = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${salt}:${hashedPassword.toString("hex")}`;
};

export const HARDCODED_USER = {
  email: "user@example.com",
  passwordHash: await hashPassword(process.env.USER_PASSWORD || ""), // This will be set dynamically via process.env.USER_PASSWORD
};

export const setHardcodedUserPassword = async (password: string) => {
  HARDCODED_USER.passwordHash = await hashPassword(password);
};

export const sanitizePassword = (value: string) =>
  value.replace(/\s/g, "").slice(0, 100);
