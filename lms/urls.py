"""MyTutor LMS — Root URL Configuration."""
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

from . import views

urlpatterns = [
    path("admin/", admin.site.urls),
    # Page views
    path("", views.landing, name="landing"),
    path("login/", views.login_view, name="login"),
    path("logout/", views.logout_view, name="logout"),
    path("register/", views.register_view, name="register"),
    path("dashboard/", views.dashboard, name="dashboard"),
    path("kids/", views.kids_view, name="kids"),
    path("parent/", views.parent_view, name="parent"),
    path("studio/", views.cms_dashboard, name="cms-dashboard"),
    path("accounts/", include("allauth.urls")),
    # API routes (DRF)
    path("api/auth/", include("lms.djangoapps.users.urls")),
    path("api/admin/", include("lms.djangoapps.users.admin_urls")),
    path("api/tutors/", include("lms.djangoapps.tutors.urls")),
    path("api/students/", include("lms.djangoapps.students.urls")),
    path("api/sessions/", include("lms.djangoapps.sessions.urls")),
    path("api/bookings/", include("lms.djangoapps.bookings.urls")),
    path("api/payments/", include("lms.djangoapps.payments.urls")),
    path("api/messages/", include("lms.djangoapps.messaging.urls")),
    path("api/kids/", include("lms.djangoapps.kids.urls")),
    path("api/parent/", include("lms.djangoapps.parents.urls")),
    path("api/submissions/", include("lms.djangoapps.submissions.urls")),
    path("api/content/", include("cms.djangoapps.content.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
