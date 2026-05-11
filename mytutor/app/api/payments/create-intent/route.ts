import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getSessionFromRequest(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { bookingId, amount, currency } = await req.json();

    if (!bookingId || !amount || !currency) {
      return NextResponse.json({ error: "bookingId, amount and currency are required" }, { status: 400 });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { session: true },
    });

    if (!booking) return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    if (booking.studentId !== session.id) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const intent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: currency.toLowerCase(),
      metadata: { bookingId, userId: session.id },
      description: `MyTutor: ${booking.session.title}`,
    });

    await prisma.booking.update({
      where: { id: bookingId },
      data: { paymentIntentId: intent.id, paymentMethod: "stripe" },
    });

    return NextResponse.json({ clientSecret: intent.client_secret });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Payment initialization failed" }, { status: 500 });
  }
}
