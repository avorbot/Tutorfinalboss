from django.urls import path
from . import views

urlpatterns = [
    path("", views.list_sessions, name="list-sessions"),
    path("create/", views.create_session, name="create-session"),
    path("mine/", views.my_sessions, name="my-sessions"),
    path("<int:session_id>/", views.session_detail, name="session-detail"),
    path("<int:session_id>/manage/", views.session_manage, name="session-manage"),
]
