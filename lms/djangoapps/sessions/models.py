from django.contrib.auth.models import User
from django.db import models


class TutorSession(models.Model):
    STATUS_CHOICES = [("active", "Active"), ("inactive", "Inactive"), ("completed", "Completed")]
    TYPE_CHOICES = [("one-on-one", "One-on-One"), ("group", "Group")]

    tutor = models.ForeignKey(User, on_delete=models.CASCADE, related_name="tutor_sessions")
    title = models.CharField(max_length=200)
    subject = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    duration = models.PositiveIntegerField(default=60, help_text="Duration in minutes")
    price = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=10, default="UGX")
    max_students = models.PositiveIntegerField(default=1)
    session_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default="one-on-one")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="active")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        app_label = "lms_sessions"

    def __str__(self):
        return f"{self.title} by {self.tutor.get_full_name()}"


class Enrollment(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name="session_enrollments")
    session = models.ForeignKey(TutorSession, on_delete=models.CASCADE, related_name="enrollments")
    status = models.CharField(max_length=20, default="active")
    enrolled_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("student", "session")
        app_label = "lms_sessions"

    def __str__(self):
        return f"{self.student.email} → {self.session.title}"
