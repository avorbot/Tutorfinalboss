from django.urls import path
from . import views

urlpatterns = [
    path("", views.list_conversations, name="conversations"),
    path("<int:partner_id>/", views.conversation, name="conversation"),
]
