import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message, phoneNumbers } = await req.json();

    if (!message || !phoneNumbers?.length) {
      return NextResponse.json(
        { error: "Message and recipients are required" },
        { status: 400 }
      );
    }

    const res = await fetch("https://sms.arkesel.com/api/v2/sms/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.ARKESEL_API_KEY!, // ✅ correct
      },
      body: JSON.stringify({
        sender: process.env.ARKESEL_SENDER, // e.g. "MyApp"
        message,
        recipients: phoneNumbers, // ["059xxxxxxx", ...]
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to send SMS", details: data },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
