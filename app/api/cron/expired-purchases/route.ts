import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyCronSecret, unauthorizedResponse } from "@/lib/cron";
import { PURCHASE_EXPIRY_MS } from "@/lib/config";

export async function GET(request: NextRequest) {
  if (!verifyCronSecret(request)) {
    return unauthorizedResponse();
  }

  const expiryCutoff = new Date(Date.now() - PURCHASE_EXPIRY_MS);

  try {
    const result = await prisma.purchase.deleteMany({
      where: {
        status: "pending",
        createdAt: {
          lte: expiryCutoff,
        },
        tickets: {
          none: {},
        },
      },
    });

    return NextResponse.json({ deleted: result.count });
  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
