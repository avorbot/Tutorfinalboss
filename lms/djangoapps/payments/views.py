"""Payment views — Stripe, PayPal, Mobile Money, Amazon Pay."""
from django.conf import settings
from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Payment
from lms.djangoapps.bookings.models import Booking


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_stripe_checkout(request):
    try:
        import stripe
        stripe.api_key = settings.STRIPE_SECRET_KEY
        booking = Booking.objects.get(id=request.data.get("booking_id"), student=request.user)
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=[{
                "price_data": {
                    "currency": booking.session.currency.lower(),
                    "product_data": {"name": booking.session.title},
                    "unit_amount": int(float(booking.session.price) * 100),
                },
                "quantity": 1,
            }],
            mode="payment",
            success_url=request.data.get("success_url", "/dashboard/"),
            cancel_url=request.data.get("cancel_url", "/dashboard/"),
            metadata={"booking_id": str(booking.id)},
        )
        return Response({"url": session.url, "session_id": session.id})
    except Exception as e:
        return Response({"error": str(e)}, status=400)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def mobile_money_payment(request):
    d = request.data
    try:
        booking = Booking.objects.get(id=d.get("booking_id"), student=request.user)
    except Booking.DoesNotExist:
        return Response({"error": "Booking not found."}, status=404)
    provider = d.get("provider", "mtn_momo")
    payment = Payment.objects.create(
        booking=booking, user=request.user,
        amount=booking.session.price, currency=booking.session.currency,
        provider=provider, status="pending",
        metadata={"phone": d.get("phone", "")},
    )
    return Response({
        "message": f"Payment initiated via {provider}. Please confirm on your phone.",
        "payment_id": payment.id, "status": "pending",
    })


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def paypal_payment(request):
    d = request.data
    try:
        booking = Booking.objects.get(id=d.get("booking_id"), student=request.user)
    except Booking.DoesNotExist:
        return Response({"error": "Booking not found."}, status=404)
    payment = Payment.objects.create(
        booking=booking, user=request.user,
        amount=booking.session.price, currency=booking.session.currency,
        provider="paypal", status="pending",
    )
    return Response({"payment_id": payment.id, "status": "pending",
                     "message": "Redirect to PayPal to complete payment."})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_payments(request):
    payments = Payment.objects.filter(user=request.user).order_by("-created_at")
    return Response([{
        "id": p.id, "amount": float(p.amount), "currency": p.currency,
        "provider": p.provider, "status": p.status, "created_at": p.created_at,
    } for p in payments])


@csrf_exempt
def stripe_webhook(request):
    payload = request.body
    sig_header = request.META.get("HTTP_STRIPE_SIGNATURE", "")
    try:
        import stripe
        stripe.api_key = settings.STRIPE_SECRET_KEY
        event = stripe.Webhook.construct_event(payload, sig_header, settings.STRIPE_WEBHOOK_SECRET)
        if event["type"] == "checkout.session.completed":
            stripe_session = event["data"]["object"]
            booking_id = stripe_session.get("metadata", {}).get("booking_id")
            if booking_id:
                booking = Booking.objects.get(id=booking_id)
                booking.payment_status = "paid"
                booking.payment_intent_id = stripe_session.get("payment_intent", "")
                booking.amount_paid = stripe_session.get("amount_total", 0) / 100
                booking.status = "confirmed"
                booking.save()
                Payment.objects.create(
                    booking=booking, user=booking.student,
                    amount=booking.amount_paid, currency=booking.session.currency,
                    provider="stripe",
                    provider_tx_id=stripe_session.get("payment_intent", ""),
                    status="completed",
                )
    except Exception:
        return HttpResponse(status=400)
    return HttpResponse(status=200)
