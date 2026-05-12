from django.urls import path
from . import views

urlpatterns = [
    path("", views.list_bookings, name="list-bookings"),
    path("create/", views.create_booking, name="create-booking"),
    path("tutor/", views.tutor_bookings, name="tutor-bookings"),
    path("<int:booking_id>/", views.booking_detail, name="booking-detail"),
]
