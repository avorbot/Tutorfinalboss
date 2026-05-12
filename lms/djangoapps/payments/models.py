from django.contrib.auth.models import User
from django.db import models

from lms.djangoapps.bookings.models import Booking


class Payment(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"), ("completed", "Completed"),
        ("failed", "Failed"), ("refunded", "Refunded"),
    ]
    PROVIDER_CHOICES = [
        ("stripe", "Stripe"), ("paypal", "PayPal"),
        ("mtn_momo", "MTN Mobile Money"), ("airtel_money", "Airtel Money"),
        ("amazon_pay", "Amazon Pay"),
    ]

    booking = models.ForeignKey(Booking, on_delete=models.CASCADE, related_name="payments")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="payments")
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=10)
    provider = models.CharField(max_length=20, choices=PROVIDER_CHOICES)
    provider_tx_id = models.CharField(max_length=200, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    metadata = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        app_label = "lms_payments"

    def __str__(self):
        return f"{self.provider} — {self.amount} {self.currency} [{self.status}]"
