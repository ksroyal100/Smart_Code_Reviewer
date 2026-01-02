import { NextResponse } from "next/server";
import { getReview } from "../utils/aiController";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const response = await getReview(body);
    return NextResponse.json({ result: response });
  } catch (error: any) {
    console.error("Error:", error.message);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
