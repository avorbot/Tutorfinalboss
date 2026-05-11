import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature") || "";
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "payment_intent.succeeded") {
    const intent = event.data.object;
    const { bookingId, userId } = intent.metadata;

    try {
      await prisma.$transaction([
        prisma.booking.update({
          where: { id: bookingId },
          data: {
            paymentStatus: "paid",
            amountPaid: intent.amount / 100,
            paidAt: new Date(),
          },
        }),
        prisma.payment.create({
          data: {
            bookingId,
            userId,
            amount: intent.amount / 100,
            currency: intent.currency.toUpperCase(),
            provider: "stripe",
            providerTxId: intent.id,
            status: "succeeded",
          },
        }),
      ]);
    } catch (err) {
      console.error("Failed to update booking payment status:", err);
    }
  }

  return NextResponse.json({ received: true });
}
