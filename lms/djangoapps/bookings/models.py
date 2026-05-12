from django.contrib.auth.models import User
from django.db import models

from lms.djangoapps.sessions.models import TutorSession


class Booking(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"), ("confirmed", "Confirmed"),
        ("completed", "Completed"), ("cancelled", "Cancelled"),
    ]
    PAYMENT_STATUS_CHOICES = [
        ("unpaid", "Unpaid"), ("paid", "Paid"), ("refunded", "Refunded"),
    ]

    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name="student_bookings")
    session = models.ForeignKey(TutorSession, on_delete=models.CASCADE, related_name="session_bookings")
    scheduled_at = models.DateTimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    notes = models.TextField(blank=True)
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default="unpaid")
    payment_method = models.CharField(max_length=50, blank=True)
    payment_intent_id = models.CharField(max_length=200, blank=True)
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    paid_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]
        app_label = "lms_bookings"

    def __str__(self):
        return f"{self.student.email} → {self.session.title} @ {self.scheduled_at}"
