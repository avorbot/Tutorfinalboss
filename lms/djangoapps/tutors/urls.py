from django.urls import path
from . import views

urlpatterns = [
    path("", views.list_tutors, name="list-tutors"),
    path("me/", views.my_tutor_profile, name="my-tutor-profile"),
    path("<int:tutor_id>/", views.tutor_detail, name="tutor-detail"),
]
