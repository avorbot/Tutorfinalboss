"""MyTutor LMS — Main page views."""
from datetime import date

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.shortcuts import redirect, render
from django.views.decorators.http import require_http_methods


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
        ctx.update({
            "total_users": User.objects.count(),
            "total_tutors": UserProfile.objects.filter(role="tutor").count(),
            "total_students": UserProfile.objects.filter(role="student").count(),
            "total_sessions": TutorSession.objects.count(),
            "pending_submissions": ContentSubmission.objects.filter(status="pending").count(),
            "pending_approvals": TutorProfile.objects.filter(verified=False).count(),
            "recent_users": UserProfile.objects.select_related("user").order_by("-created_at")[:5],
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
            "upcoming_bookings": upcoming,
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
        email = request.POST.get("email", "").strip()
        password = request.POST.get("password", "")
        try:
            user_obj = User.objects.get(email=email)
            user = authenticate(request, username=user_obj.username, password=password)
        except User.DoesNotExist:
            user = None
        if user:
            login(request, user)
            return redirect(request.GET.get("next", "/dashboard/"))
        error = "Invalid email or password. Please try again."
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
        name = request.POST.get("name", "").strip()
        email = request.POST.get("email", "").strip()
        password = request.POST.get("password", "")
        password2 = request.POST.get("password2", "")
        role = request.POST.get("role", "student")
        if password != password2:
            error = "Passwords do not match."
        elif not name or not email:
            error = "Name and email are required."
        elif User.objects.filter(email=email).exists():
            error = "An account with this email already exists."
        else:
            parts = name.split(" ", 1)
            first = parts[0]
            last = parts[1] if len(parts) > 1 else ""
            username = email.split("@")[0]
            base = username
            i = 1
            while User.objects.filter(username=username).exists():
                username = f"{base}{i}"
                i += 1
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
