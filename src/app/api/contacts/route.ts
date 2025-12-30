import prisma from "@/lib/db";
import { NextResponse } from "next/server";

// GET /api/contacts
export async function GET() {
  const contacts = await prisma.contacts.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(contacts);
}

// POST /api/contacts
export async function POST(req: Request) {
  const body = await req.json();

  const { name, phone, email, address } = body;

  if (!name || !phone) {
    return NextResponse.json(
      { message: "Name and phone are required" },
      { status: 400 }
    );
  }

  const contact = await prisma.contacts.create({
    data: {
      name,
      phone,
      email,
      address,
    },
  });

  return NextResponse.json(contact, { status: 201 });
}

export async function DELETE(req: Request) {
  const { id } = await req.json();

  await prisma.contacts.delete({
    where: { id },
  });

  return NextResponse.json({ success: true });
}
