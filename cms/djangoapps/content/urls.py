from django.urls import path
from . import views

urlpatterns = [
    path("library/", views.content_library, name="content-library"),
    path("pending/", views.pending_review, name="cms-pending-review"),
]
