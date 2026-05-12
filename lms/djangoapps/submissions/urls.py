from django.urls import path
from . import views

urlpatterns = [
    path("", views.submissions, name="submissions"),
    path("pending/", views.pending_submissions, name="pending-submissions"),
    path("<int:submission_id>/review/", views.review_submission, name="review-submission"),
]
