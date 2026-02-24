import { NextResponse } from "next/server";
import { runAssessment } from "@/lib/ai/recommendation";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const result = await runAssessment(body);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}