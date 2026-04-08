import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { CREDIT_PACKAGES } from "@/lib/credits";
import { buildShopierForm } from "@/services/shopier";

/**
 * POST /api/credits/purchase
 *
 * Creates a pending order in the database, then returns the
 * Shopier payment form data (action URL + hidden fields) for
 * the client to auto-submit.
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

    // Amount in TRY (e.g. 14999 kuruş → "149.99" TRY)
    const amountTRY = (pkg.price / 100).toFixed(2);

    // Create a pending order in the database
    const { data: orderIdData, error: orderError } = await supabase.rpc(
      "create_order",
      {
        p_user_id: user.id,
        p_package_id: pkg.id,
        p_credits: pkg.credits,
        p_amount: parseFloat(amountTRY),
        p_currency: "TRY",
      }
    );

    if (orderError || !orderIdData) {
      console.error("[purchase] order creation failed:", orderError);
      return NextResponse.json(
        { success: false, error: "Failed to create order" },
        { status: 500 }
      );
    }

    const orderId = orderIdData as string;

    // Get user details for Shopier form
    const displayName =
      user.user_metadata?.username || user.email?.split("@")[0] || "User";
    const email = user.email || "user@example.com";

    // Build Shopier payment form
    const formData = buildShopierForm({
      orderId,
      amount: amountTRY,
      currency: "TRY",
      productName: `${pkg.name} - ${pkg.credits} Credits`,
      buyerName: displayName,
      buyerSurname: "",
      buyerEmail: email,
      buyerPhone: "05000000000",
      buyerAddress: "Digital Product",
      buyerCity: "Istanbul",
      buyerCountry: "TR",
    });

    return NextResponse.json({
      success: true,
      orderId,
      shopierForm: formData,
    });
  } catch (error) {
    console.error("Purchase error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
