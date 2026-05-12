from django.urls import path
from . import views

urlpatterns = [
    path("register/", views.api_register, name="api-register"),
    path("login/", views.api_login, name="api-login"),
    path("logout/", views.api_logout, name="api-logout"),
    path("me/", views.api_me, name="api-me"),
    path("profile/", views.api_update_profile, name="api-profile"),
]
