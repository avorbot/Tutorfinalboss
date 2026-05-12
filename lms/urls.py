"""MyTutor LMS — Root URL Configuration."""
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

from . import views

_s = views._stub  # shorthand for stub views

urlpatterns = [
    path("admin/", admin.site.urls),
    # ── Auth ──────────────────────────────────────────────────
    path("", views.landing, name="landing"),
    path("login/", views.login_view, name="login"),
    path("logout/", views.logout_view, name="logout"),
    path("register/", views.register_view, name="register"),
    path("accounts/", include("allauth.urls")),
    # ── Core Pages ────────────────────────────────────────────
    path("dashboard/", views.dashboard, name="dashboard"),
    path("kids/", views.kids_view, name="kids_view"),
    path("parent/", views.parent_view, name="parent"),
    path("studio/", views.cms_dashboard, name="cms_dashboard"),
    path("profile/", _s, name="profile"),
    path("settings/", _s, name="settings"),
    path("messaging/", _s, name="messaging"),
    # ── Tutors ────────────────────────────────────────────────
    path("tutors/", _s, name="tutors_list"),
    # ── Sessions ──────────────────────────────────────────────
    path("sessions/", _s, name="sessions_list"),
    path("sessions/new/", _s, name="session_create"),
    path("sessions/<int:pk>/", _s, name="session_detail"),
    # ── Bookings ──────────────────────────────────────────────
    path("bookings/", _s, name="bookings_list"),
    # ── Payments ──────────────────────────────────────────────
    path("payments/", _s, name="payments_list"),
    # ── Students ──────────────────────────────────────────────
    path("students/", _s, name="students_list"),
    # ── Kids Zone ─────────────────────────────────────────────
    path("kids/subjects/", _s, name="kids_subjects"),
    path("kids/badges/", _s, name="kids_badges"),
    path("kids/progress/", _s, name="kids_progress"),
    # ── Parent Portal ─────────────────────────────────────────
    path("parent/kids/", _s, name="parent_kids"),
    path("parent/progress/", _s, name="parent_progress"),
    path("parent/sessions/", _s, name="parent_sessions"),
    path("parent/verify-pin/", _s, name="parent_verify_pin"),
    path("parent/kid/<int:pk>/progress/", _s, name="parent_kid_progress"),
    # ── Admin Panel ───────────────────────────────────────────
    path("manage/users/", _s, name="admin_users"),
    path("manage/tutors/", _s, name="admin_tutors"),
    path("manage/sessions/", _s, name="admin_sessions"),
    path("manage/payments/", _s, name="admin_payments"),
    path("manage/submissions/", _s, name="admin_submissions"),
    path("manage/tutors/<int:pk>/approve/", _s, name="admin_approve_tutor"),
    path("manage/users/<int:pk>/delete/", _s, name="admin_delete_user"),
    path("manage/users/<int:pk>/", _s, name="admin_user_detail"),
    # ── CMS Studio ────────────────────────────────────────────
    path("studio/library/", _s, name="cms_library"),
    path("studio/pending/", _s, name="cms_pending"),
    path("studio/upload/", _s, name="cms_upload"),
    path("studio/review/<int:pk>/", _s, name="cms_review"),
    path("studio/submissions/<int:pk>/", _s, name="cms_submission_detail"),
    path("studio/approve/<int:pk>/", _s, name="cms_approve"),
    path("studio/reject/<int:pk>/", _s, name="cms_reject"),
    # ── API Routes (DRF) ──────────────────────────────────────
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
