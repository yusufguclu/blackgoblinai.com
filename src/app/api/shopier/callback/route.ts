import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseShopierCallback } from "@/services/shopier";

/**
 * POST /api/shopier/callback
 *
 * Shopier calls this endpoint (server-to-server) after payment completes.
 * We verify the payment, then mark the order as completed and add credits.
 */
export async function POST(req: NextRequest) {
  try {
    // Parse form-encoded body from Shopier
    const contentType = req.headers.get("content-type") || "";
    let body: Record<string, string> = {};

    if (contentType.includes("application/x-www-form-urlencoded")) {
      const text = await req.text();
      const params = new URLSearchParams(text);
      params.forEach((value, key) => {
        body[key] = value;
      });
    } else if (contentType.includes("application/json")) {
      body = await req.json();
    } else {
      // Try to parse as form data
      const text = await req.text();
      const params = new URLSearchParams(text);
      params.forEach((value, key) => {
        body[key] = value;
      });
    }

    console.log("[shopier/callback] received:", JSON.stringify(body));

    // Parse the callback data
    const payment = parseShopierCallback(body);

    if (!payment.orderId) {
      console.error("[shopier/callback] missing order ID");
      return NextResponse.json({ error: "Missing order ID" }, { status: 400 });
    }

    // Check payment status: "1" = success
    if (payment.status !== "1") {
      console.log("[shopier/callback] payment failed or cancelled:", payment.status);

      // Mark order as failed
      const supabase = await createClient();
      await supabase.rpc("fail_order", {
        p_order_id: payment.orderId,
      });

      return NextResponse.json({ status: "failed" });
    }

    // Payment successful — complete the order and add credits
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("complete_order", {
      p_order_id: payment.orderId,
      p_shopier_payment_id: payment.paymentId || "unknown",
    });

    if (error) {
      console.error("[shopier/callback] complete_order error:", error);
      return NextResponse.json(
        { error: "Failed to complete order" },
        { status: 500 }
      );
    }

    console.log("[shopier/callback] order completed:", {
      orderId: payment.orderId,
      paymentId: payment.paymentId,
      result: data,
    });

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("[shopier/callback] unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Also handle GET in case Shopier pings the endpoint
export async function GET() {
  return NextResponse.json({ status: "callback endpoint active" });
}
