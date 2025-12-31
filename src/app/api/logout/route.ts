import { cookies } from "next/headers";

export async function POST(req: Request) {
  (await cookies()).delete("session");

  return Response.json({ success: true });
}
