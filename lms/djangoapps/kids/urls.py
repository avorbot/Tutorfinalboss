from django.urls import path
from . import views

urlpatterns = [
    path("", views.list_kids, name="list-kids"),
    path("create/", views.create_kid, name="create-kid"),
    path("<int:kid_id>/progress/", views.kid_progress, name="kid-progress"),
    path("<int:kid_id>/progress/update/", views.update_kid_progress, name="update-kid-progress"),
]
