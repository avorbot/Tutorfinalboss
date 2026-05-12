from django.urls import path
from . import views

urlpatterns = [
    path("", views.parent_profile, name="parent-profile"),
    path("verify-pin/", views.verify_pin, name="verify-pin"),
    path("kids/", views.list_kids, name="parent-kids"),
]
