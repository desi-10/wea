import { cookies } from "next/headers";
import { hashPassword, HARDCODED_USER } from "@/lib/auth-utils";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  const hashed = await hashPassword(password);

  if (
    email !== HARDCODED_USER.email ||
    hashed !== HARDCODED_USER.passwordHash
  ) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  (await cookies()).set({
    name: "session",
    value: crypto.randomUUID(),
    httpOnly: true, // 🔒 JS can't access
    secure: true, // HTTPS only
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 1 day
  });

  return Response.json({ success: true });
}
