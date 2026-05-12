from django.contrib.auth.models import User
from django.db import models


class ParentProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="parent_profile")
    pin = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        app_label = "lms_parents"

    def __str__(self):
        return f"Parent: {self.user.get_full_name() or self.user.email}"
