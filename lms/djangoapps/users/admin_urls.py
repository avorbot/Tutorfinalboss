from django.urls import path
from . import admin_views

urlpatterns = [
    path("users/", admin_views.list_users, name="admin-users"),
    path("users/<int:user_id>/", admin_views.user_detail, name="admin-user-detail"),
    path("users/<int:user_id>/approve/", admin_views.approve_tutor, name="admin-approve-tutor"),
    path("users/<int:user_id>/delete/", admin_views.delete_user, name="admin-delete-user"),
    path("stats/", admin_views.platform_stats, name="admin-stats"),
]
