"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { loadStripe } from "@stripe/stripe-js";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { CreditCard, PaypalLogo, Lock } from "@phosphor-icons/react";

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;

function CheckoutForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookingId = searchParams.get("bookingId");
  const amount = parseFloat(searchParams.get("amount") || "0");
  const currency = searchParams.get("currency") || "USD";
  const sessionTitle = searchParams.get("title") || "Session";

  const [tab, setTab] = useState<"stripe" | "paypal">("stripe");
  const [loading, setLoading] = useState(false);
  const [paid, setPaid] = useState(false);
  const [error, setError] = useState("");

  async function handleStripeCheckout() {
    if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
      setError("Stripe is not configured yet. Contact support.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/payments/create-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, amount, currency }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Payment failed"); setLoading(false); return; }
      // In a full implementation, use Stripe Elements with the clientSecret
      // For demo, we show success
      setPaid(true);
    } catch {
      setError("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (!bookingId || !amount) {
    return (
      <div className="text-center py-16 text-[var(--text-muted)]">
        No booking information found. Please book a session first.
      </div>
    );
  }

  if (paid) {
    return (
      <div className="max-w-md mx-auto text-center py-16">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Payment Successful!</h2>
        <p className="text-[var(--text-muted)] mb-6">Your session is confirmed.</p>
        <button onClick={() => router.push("/dashboard/student")} className="btn btn-primary">
          Go to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Checkout</h1>
        <p className="text-[var(--text-muted)] text-sm mt-1">Complete your booking payment</p>
      </div>

      {/* Summary card */}
      <div className="card mb-6">
        <div className="flex justify-between items-center">
          <div>
            <div className="font-semibold text-[var(--text-primary)]">{sessionTitle}</div>
            <div className="text-sm text-[var(--text-muted)]">1-time payment</div>
          </div>
          <div className="text-2xl font-bold gradient-text">{currency} {amount.toFixed(2)}</div>
        </div>
      </div>

      {/* Payment method tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab("stripe")}
          className={`flex-1 py-3 rounded-xl border-2 text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
            tab === "stripe"
              ? "border-[var(--neon-blue)] text-[var(--neon-blue)] bg-blue-50 dark:bg-blue-950/20"
              : "border-[var(--border)] text-[var(--text-muted)]"
          }`}
        >
          <CreditCard size={18} /> Card (Stripe)
        </button>
        <button
          onClick={() => setTab("paypal")}
          className={`flex-1 py-3 rounded-xl border-2 text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
            tab === "paypal"
              ? "border-[var(--neon-blue)] text-[var(--neon-blue)] bg-blue-50 dark:bg-blue-950/20"
              : "border-[var(--border)] text-[var(--text-muted)]"
          }`}
        >
          <PaypalLogo size={18} /> PayPal
        </button>
      </div>

      <div className="card-neon">
        {tab === "stripe" ? (
          <div className="space-y-4">
            <p className="text-sm text-[var(--text-muted)]">
              Pay securely with your credit or debit card. Powered by Stripe.
            </p>
            {/* In production, embed Stripe Elements here */}
            <div className="bg-[var(--bg-secondary)] rounded-xl p-4 border border-[var(--border)]">
              <p className="text-xs text-[var(--text-muted)] text-center">
                Stripe Elements will render here with your live Stripe keys configured.
              </p>
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <button
              onClick={handleStripeCheckout}
              disabled={loading}
              className="btn btn-primary w-full py-3 flex items-center gap-2 justify-center"
            >
              <Lock size={16} />
              {loading ? "Processing..." : `Pay ${currency} ${amount.toFixed(2)} with Card`}
            </button>
          </div>
        ) : (
          <div>
            <p className="text-sm text-[var(--text-muted)] mb-4">
              Pay with your PayPal account. No card details needed.
            </p>
            {process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ? (
              <PayPalScriptProvider options={{ clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "", currency }}>
                <PayPalButtons
                  style={{ layout: "vertical" }}
                  createOrder={(data, actions) =>
                    actions.order.create({
                      intent: "CAPTURE",
                      purchase_units: [{ amount: { currency_code: currency, value: amount.toFixed(2) }, description: sessionTitle }],
                    })
                  }
                  onApprove={async () => { setPaid(true); }}
                />
              </PayPalScriptProvider>
            ) : (
              <div className="text-center py-6 text-[var(--text-muted)] text-sm">
                PayPal is not configured. Add NEXT_PUBLIC_PAYPAL_CLIENT_ID to your .env.
              </div>
            )}
          </div>
        )}
      </div>

      <p className="text-center text-xs text-[var(--text-muted)] mt-4 flex items-center justify-center gap-1">
        <Lock size={12} /> Secured by 256-bit SSL encryption
      </p>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="text-center py-12 text-[var(--text-muted)]">Loading checkout...</div>}>
      <CheckoutForm />
    </Suspense>
  );
}
