from django.db import models


class KidsAccount(models.Model):
    parent = models.ForeignKey(
        "lms_parents.ParentProfile", on_delete=models.CASCADE, related_name="kids"
    )
    name = models.CharField(max_length=100)
    age = models.PositiveIntegerField()
    avatar_id = models.CharField(max_length=10, default="1")
    points = models.PositiveIntegerField(default=0)
    level = models.PositiveIntegerField(default=1)
    badges = models.JSONField(default=list)
    favourite_color = models.CharField(max_length=20, default="green")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        app_label = "lms_kids"

    def __str__(self):
        return f"{self.name} (age {self.age})"


class KidsProgress(models.Model):
    kid = models.ForeignKey(KidsAccount, on_delete=models.CASCADE, related_name="progress")
    subject = models.CharField(max_length=100)
    lessons_completed = models.PositiveIntegerField(default=0)
    stars = models.PositiveIntegerField(default=0)
    last_activity = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ("kid", "subject")
        app_label = "lms_kids"

    def __str__(self):
        return f"{self.kid.name} — {self.subject}: {self.stars}⭐"
