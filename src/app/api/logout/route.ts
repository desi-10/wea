import { cookies } from "next/headers";

export async function POST(req: Request) {
  (await cookies()).set({
    name: "session",
    value: "",
    maxAge: 0,
    path: "/",
  });

  return Response.json({ success: true });
}
