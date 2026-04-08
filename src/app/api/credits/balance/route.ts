import { NextResponse } from "next/server";
import { getUserCredits } from "@/lib/credits";

/**
 * GET /api/credits/balance
 *
 * Returns the current user's credit balance.
 */
export async function GET() {
  try {
    const credits = await getUserCredits();

    if (credits === null) {
      return NextResponse.json(
        { success: false, credits: null, error: "Not authenticated" },
        { status: 401 }
      );
    }

    return NextResponse.json({ success: true, credits });
  } catch (error) {
    console.error("Balance check error:", error);
    return NextResponse.json(
      { success: false, credits: null, error: "Internal server error" },
      { status: 500 }
    );
  }
}
