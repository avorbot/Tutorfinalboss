from django.contrib.auth.models import User
from django.db import models


class TutorProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="tutor_profile")
    bio = models.TextField(blank=True)
    subjects = models.TextField(blank=True, help_text="Comma-separated list of subjects")
    hourly_rate = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    currency = models.CharField(max_length=10, default="UGX")
    experience_years = models.PositiveIntegerField(default=0)
    education = models.TextField(blank=True)
    verified = models.BooleanField(default=False)
    rating = models.FloatField(default=0.0)
    total_reviews = models.PositiveIntegerField(default=0)
    availability = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        app_label = "lms_tutors"

    def __str__(self):
        return f"Tutor: {self.user.get_full_name() or self.user.email}"

    @property
    def subject_list(self):
        return [s.strip() for s in self.subjects.split(",") if s.strip()]
