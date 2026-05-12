"""MyTutor LMS — Main page views."""
from datetime import date

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.http import HttpResponse
from django.shortcuts import get_object_or_404, redirect, render
from django.views.decorators.http import require_http_methods


@login_required
def _stub(request, **kwargs):
    """Placeholder for pages that are in progress."""
    label = request.resolver_match.url_name.replace("_", " ").title()
    html = f"""<!DOCTYPE html>
<html data-theme="dark"><head>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@600;700&family=Plus+Jakarta+Sans:wght@400;500&display=swap" rel="stylesheet">
<style>
:root{{--primary:#1a7a3c;--accent:#f97316;--bg:#0f172a;--text:#f1f5f9}}
*{{margin:0;padding:0;box-sizing:border-box}}
body{{background:var(--bg);color:var(--text);font-family:'Plus Jakarta Sans',sans-serif;min-height:100vh;display:flex;align-items:center;justify-content:center}}
.card{{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:48px;text-align:center;max-width:480px}}
h1{{font-family:Poppins,sans-serif;font-size:2rem;background:linear-gradient(135deg,#1a7a3c,#f97316);-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:12px}}
p{{color:#94a3b8;margin-bottom:24px}}
a{{background:var(--primary);color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600}}
</style>
</head><body>
<div class="card">
  <h1>{label}</h1>
  <p>This page is coming soon.</p>
  <a href="/dashboard/">&larr; Back to Dashboard</a>
</div>
</body></html>"""
    return HttpResponse(html)


def _get_profile(user):
    return getattr(user, "profile", None)


def _base_ctx(user):
    profile = _get_profile(user)
    return {
        "full_name": user.get_full_name() or user.username,
        "first_name": user.first_name or user.username,
        "email": user.email,
        "role": profile.role if profile else "student",
        "role_display": profile.get_role_display() if profile else "Student",
        "is_admin_user": user.is_staff or (profile and profile.role == "admin"),
    }


def landing(request):
    if request.user.is_authenticated:
        return redirect("dashboard")
    return render(request, "landing.html")


@login_required
def dashboard(request):
    user = request.user
    profile = _get_profile(user)
    role = profile.role if profile else "student"
    ctx = _base_ctx(user)
    today = date.today().strftime("%A, %B %d, %Y")
    ctx["today"] = today

    if role in ("admin",) or user.is_staff:
        from lms.djangoapps.users.models import UserProfile
        from lms.djangoapps.sessions.models import TutorSession
        from lms.djangoapps.submissions.models import ContentSubmission
        from lms.djangoapps.tutors.models import TutorProfile
        pending_tutors_qs = TutorProfile.objects.filter(verified=False).select_related("user")
        pending_subs_qs = ContentSubmission.objects.filter(status="pending").select_related("submitted_by").order_by("-created_at")[:5]
        recent_users_qs = User.objects.select_related("profile").order_by("-date_joined")[:5]
        ctx.update({
            "stats": {
                "total_users": User.objects.count(),
                "total_tutors": UserProfile.objects.filter(role="tutor").count(),
                "total_students": UserProfile.objects.filter(role="student").count(),
                "total_sessions": TutorSession.objects.count(),
                "total_revenue": "0.00",
                "pending_tutors": pending_tutors_qs.count(),
            },
            "pending_tutors": pending_tutors_qs[:5],
            "pending_submissions": pending_subs_qs,
            "recent_users": recent_users_qs,
        })
        return render(request, "dashboard/admin.html", ctx)

    elif role == "tutor":
        from lms.djangoapps.sessions.models import TutorSession
        from lms.djangoapps.bookings.models import Booking
        sessions = TutorSession.objects.filter(tutor=user).order_by("-created_at")
        upcoming = Booking.objects.filter(
            session__tutor=user, status__in=["pending", "confirmed"]
        ).select_related("student", "session").order_by("scheduled_at")[:5]
        ctx.update({
            "tutor_profile": getattr(user, "tutor_profile", None),
            "sessions": sessions,
            "session_count": sessions.count(),
            "upcoming_sessions": upcoming,
            "total_students": Booking.objects.filter(
                session__tutor=user
            ).values("student").distinct().count(),
        })
        return render(request, "dashboard/tutor.html", ctx)

    elif role == "kid":
        from lms.djangoapps.kids.models import KidsAccount
        from lms.djangoapps.parents.models import ParentProfile
        parent_profile = getattr(user, "parent_profile", None)
        kids = KidsAccount.objects.filter(parent=parent_profile) if parent_profile else []
        ctx.update({"kids": kids})
        return render(request, "dashboard/kids.html", ctx)

    elif role == "parent":
        from lms.djangoapps.kids.models import KidsAccount
        from lms.djangoapps.parents.models import ParentProfile
        parent_profile = getattr(user, "parent_profile", None)
        kids = KidsAccount.objects.filter(parent=parent_profile) if parent_profile else []
        ctx.update({"parent_profile": parent_profile, "kids": kids, "kids_count": len(list(kids))})
        return render(request, "dashboard/parent.html", ctx)

    else:  # student
        from lms.djangoapps.bookings.models import Booking
        from lms.djangoapps.sessions.models import TutorSession
        upcoming = Booking.objects.filter(
            student=user, status__in=["pending", "confirmed"]
        ).select_related("session", "session__tutor").order_by("scheduled_at")[:5]
        available = TutorSession.objects.filter(status="active").select_related("tutor")[:6]
        ctx.update({
            "upcoming_sessions": upcoming,
            "booking_count": Booking.objects.filter(student=user).count(),
            "available_sessions": available,
        })
        return render(request, "dashboard/student.html", ctx)


@login_required
def kids_view(request):
    return render(request, "dashboard/kids.html", _base_ctx(request.user))


@login_required
def parent_view(request):
    from lms.djangoapps.kids.models import KidsAccount
    from lms.djangoapps.parents.models import ParentProfile
    user = request.user
    ctx = _base_ctx(user)
    parent_profile = getattr(user, "parent_profile", None)
    kids = KidsAccount.objects.filter(parent=parent_profile) if parent_profile else []
    ctx.update({"parent_profile": parent_profile, "kids": kids})
    return render(request, "dashboard/parent.html", ctx)


@login_required
def cms_dashboard(request):
    from lms.djangoapps.submissions.models import ContentSubmission
    user = request.user
    ctx = _base_ctx(user)
    profile = _get_profile(user)
    role = profile.role if profile else "student"
    if role == "admin" or user.is_staff:
        ctx["pending_submissions"] = ContentSubmission.objects.filter(
            status="pending"
        ).select_related("submitted_by").order_by("-created_at")
        ctx["approved_submissions"] = ContentSubmission.objects.filter(
            status="approved"
        ).select_related("submitted_by").order_by("-reviewed_at")[:10]
    else:
        ctx["my_submissions"] = ContentSubmission.objects.filter(
            submitted_by=user
        ).order_by("-created_at")
    return render(request, "cms/cms_dashboard.html", ctx)


@require_http_methods(["GET", "POST"])
def login_view(request):
    if request.user.is_authenticated:
        return redirect("dashboard")
    error = None
    if request.method == "POST":
        identifier = request.POST.get("username", "").strip()
        password = request.POST.get("password", "")
        # Support login by email or username
        if "@" in identifier:
            try:
                user_obj = User.objects.get(email=identifier)
                identifier = user_obj.username
            except User.DoesNotExist:
                pass
        user = authenticate(request, username=identifier, password=password)
        if user:
            login(request, user)
            return redirect(request.GET.get("next", "/dashboard/"))
        error = "Invalid credentials. Please try again."
    return render(request, "auth/login.html", {"error": error})


def logout_view(request):
    logout(request)
    return redirect("/")


@require_http_methods(["GET", "POST"])
def register_view(request):
    if request.user.is_authenticated:
        return redirect("dashboard")
    error = None
    if request.method == "POST":
        from lms.djangoapps.users.models import UserProfile
        from lms.djangoapps.tutors.models import TutorProfile
        from lms.djangoapps.parents.models import ParentProfile
        first = request.POST.get("first_name", "").strip()
        last = request.POST.get("last_name", "").strip()
        email = request.POST.get("email", "").strip()
        username = request.POST.get("username", "").strip()
        password = request.POST.get("password", "")
        role = request.POST.get("role", "student")
        if not first or not email or not username:
            error = "First name, email, and username are required."
        elif User.objects.filter(email=email).exists():
            error = "An account with this email already exists."
        elif User.objects.filter(username=username).exists():
            error = "That username is already taken."
        elif len(password) < 8:
            error = "Password must be at least 8 characters."
        else:
            user = User.objects.create_user(
                username=username, email=email,
                first_name=first, last_name=last, password=password,
            )
            UserProfile.objects.create(user=user, role=role)
            if role == "tutor":
                TutorProfile.objects.create(user=user)
            elif role == "parent":
                pin = request.POST.get("pin", "0000")
                ParentProfile.objects.create(user=user, pin=pin)
            login(request, user)
            return redirect("dashboard")
    roles = [
        {"value": "student", "label": "Student", "icon": "🎓"},
        {"value": "tutor", "label": "Tutor", "icon": "📚"},
        {"value": "parent", "label": "Parent", "icon": "👨‍👧"},
    ]
    return render(request, "auth/register.html", {"error": error, "roles": roles})
