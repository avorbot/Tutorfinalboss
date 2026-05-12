from django.urls import path
from . import views

urlpatterns = [
    path("profile/", views.student_profile, name="student-profile"),
    path("bookings/", views.my_bookings, name="student-bookings"),
]
