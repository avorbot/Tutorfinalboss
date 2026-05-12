from django.contrib.auth.models import User
from django.db import models


class ContentSubmission(models.Model):
    STATUS_CHOICES = [("pending", "Pending"), ("approved", "Approved"), ("rejected", "Rejected")]
    TYPE_CHOICES = [("video", "Video"), ("pdf", "PDF/Document"), ("article", "Article"), ("quiz", "Quiz")]
    DIRECTION_CHOICES = [("lms_to_cms", "LMS → CMS"), ("cms_to_lms", "CMS → LMS")]

    submitted_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name="submissions")
    session = models.ForeignKey(
        "lms_sessions.TutorSession", on_delete=models.SET_NULL,
        null=True, blank=True, related_name="submissions"
    )
    direction = models.CharField(max_length=20, choices=DIRECTION_CHOICES, default="lms_to_cms")
    content_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default="article")
    title = models.CharField(max_length=200)
    content = models.TextField()
    description = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    reviewed_by = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True, related_name="reviewed_submissions"
    )
    review_note = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-created_at"]
        app_label = "lms_submissions"

    def __str__(self):
        return f"{self.title} [{self.status}]"
