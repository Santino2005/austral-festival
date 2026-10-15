import { NextRequest, NextResponse } from "next/server";

export function verifyCronSecret(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const auth = req.headers.get("authorization");
  return auth === `Bearer ${secret}`;
}

export function unauthorizedResponse() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export function checkoutUrl(preferenceId: string): string {
  const isSandbox = (process.env.MP_ACCESS_TOKEN ?? "").startsWith("TEST-");
  const base = isSandbox
    ? "https://sandbox.mercadopago.com.ar/checkout/v1/redirect"
    : "https://www.mercadopago.com.ar/checkout/v1/redirect";
  return `${base}?pref_id=${preferenceId}`;
}
