import { NextResponse } from "next/server";
import { users } from "@/lib/auth";

export async function POST(req: Request) {
  const body = await req.json();

  const exists = users.find((u) => u.email === body.email);

  if (exists) {
    return NextResponse.json({ error: "User exists" }, { status: 400 });
  }

  users.push({
    id: Date.now().toString(),
    email: body.email,
    password: body.password,
  });

  return NextResponse.json({ success: true });
}