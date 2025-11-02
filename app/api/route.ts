import { NextResponse } from "next/server";

export const runtime = "edge"; // ⚡ Run at Edge

export async function GET() {
  return NextResponse.json({ message: "Hello World" });
}
