import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { addCredits, CREDIT_PACKAGES } from "@/lib/credits";

/**
 * POST /api/credits/purchase
 *
 * Mock purchase endpoint — in production, replace with real payment provider
 * (Stripe, Lemonsqueezy, etc.) and verify payment before adding credits.
 */
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { packageId } = body;

    // Find the package
    const pkg = CREDIT_PACKAGES.find((p) => p.id === packageId);
    if (!pkg) {
      return NextResponse.json(
        { success: false, error: "Invalid package" },
        { status: 400 }
      );
    }

    // TODO: Integrate real payment provider here
    // For now, add credits directly (mock purchase)
    const ok = await addCredits(user.id, pkg.credits);

    if (!ok) {
      return NextResponse.json(
        { success: false, error: "Failed to add credits" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      credits: pkg.credits,
      message: `Added ${pkg.credits} credits to your account`,
    });
  } catch (error) {
    console.error("Purchase error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
