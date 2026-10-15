import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { verifyCronSecret, unauthorizedResponse, checkoutUrl } from "@/lib/cron";
import {
  REMINDER_1_DELAY_MS,
  REMINDER_2_DELAY_MS,
  PURCHASE_EXPIRY_MS,
} from "@/lib/config";

export async function GET(request: NextRequest) {
  if (!verifyCronSecret(request)) {
    return unauthorizedResponse();
  }

  const now = Date.now();
  const cutoff1 = new Date(now - REMINDER_1_DELAY_MS);
  const cutoff2 = new Date(now - REMINDER_2_DELAY_MS);
  const expiryCutoff = new Date(now - PURCHASE_EXPIRY_MS);

  try {
    const q1 = await prisma.purchase.findMany({
      where: {
        status: "pending",
        mpPreferenceId: { not: null },
        remindersSent: 0,
        createdAt: {
          lte: cutoff1,
          gt: expiryCutoff,
        },
      },
      include: {
        tier: {
          include: { event: true },
        },
      },
    });

    const q2 = await prisma.purchase.findMany({
      where: {
        status: "pending",
        mpPreferenceId: { not: null },
        remindersSent: 1,
        createdAt: {
          lte: cutoff2,
          gt: expiryCutoff,
        },
      },
      include: {
        tier: {
          include: { event: true },
        },
      },
    });

    const purchases = [...q1, ...q2];

    let processed = 0;
    let errors = 0;

    for (const purchase of purchases) {
      if (!purchase.mpPreferenceId) continue;

      const isSecondReminder = purchase.remindersSent === 1;
      const url = checkoutUrl(purchase.mpPreferenceId);

      const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; margin: 0; padding: 0; background-color: #faf8f5; color: #1c1917; }
    .container { max-width: 560px; margin: 40px auto; background: #ffffff; border-radius: 14px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
    .header { background: #1c1917; color: #ffffff; padding: 32px 24px; text-align: center; }
    .header h1 { margin: 0; font-size: 24px; font-weight: 600; letter-spacing: -0.02em; }
    .header p { margin: 8px 0 0 0; color: #a8a29e; font-size: 15px; }
    .content { padding: 32px 24px; }
    .greeting { font-size: 18px; font-weight: 500; margin: 0 0 16px 0; }
    .text { font-size: 16px; line-height: 1.5; color: #44403c; margin: 0 0 24px 0; }
    .button-container { text-align: center; margin: 32px 0; }
    .button { display: inline-block; background-color: #ea580c; color: #ffffff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 500; font-size: 16px; }
    .warning { font-size: 14px; color: #dc2626; margin: 24px 0 0 0; text-align: center; font-weight: 500; }
    .footer { background: #f5f5f4; padding: 24px; text-align: center; color: #78716c; font-size: 14px; border-top: 1px solid #e7e5e4; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Peña Folklórica Austral</h1>
      <p>Tu compra está pendiente</p>
    </div>
    <div class="content">
      <p class="greeting">Hola ${purchase.buyerName},</p>
      <p class="text">Tu compra de ${purchase.quantity} entrada(s) tipo ${purchase.tier.name} está pendiente de pago. Para asegurar tus entradas, por favor completá el pago.</p>
      <div class="button-container">
        <a href="${url}" class="button">Completar pago</a>
      </div>
      ${isSecondReminder ? '<p class="warning">Atención: tu compra expirará pronto si no se completa el pago.</p>' : ""}
    </div>
    <div class="footer">
      Peña Folklórica · Universidad Austral
    </div>
  </div>
</body>
</html>
      `;

      try {
        await sendEmail({
          to: purchase.buyerEmail,
          subject: "Completá tu compra — Peña Folk Austral",
          html,
        });

        await prisma.purchase.update({
          where: { id: purchase.id },
          data: {
            remindersSent: purchase.remindersSent + 1,
            lastReminderAt: new Date(),
          },
        });

        processed++;
      } catch {
        errors++;
      }
    }

    return NextResponse.json({ processed, errors });
  } catch {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
