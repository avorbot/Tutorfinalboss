"""Admin API views."""
from django.contrib.auth.models import User
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response

from .models import UserProfile
from lms.djangoapps.tutors.models import TutorProfile


@api_view(["GET"])
@permission_classes([IsAdminUser])
def list_users(request):
    role = request.query_params.get("role")
    profiles = UserProfile.objects.select_related("user").order_by("-created_at")
    if role:
        profiles = profiles.filter(role=role)
    data = [{
        "id": p.user.id, "name": p.user.get_full_name() or p.user.username,
        "email": p.user.email, "role": p.role,
        "date_joined": p.user.date_joined, "created_at": p.created_at,
    } for p in profiles]
    return Response(data)


@api_view(["GET"])
@permission_classes([IsAdminUser])
def user_detail(request, user_id):
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({"error": "Not found."}, status=404)
    profile = getattr(user, "profile", None)
    tutor_profile = getattr(user, "tutor_profile", None)
    return Response({
        "id": user.id, "name": user.get_full_name() or user.username,
        "email": user.email, "role": profile.role if profile else "student",
        "is_staff": user.is_staff,
        "tutor_verified": tutor_profile.verified if tutor_profile else False,
        "date_joined": user.date_joined,
    })


@api_view(["POST"])
@permission_classes([IsAdminUser])
def approve_tutor(request, user_id):
    try:
        tutor_profile = TutorProfile.objects.get(user_id=user_id)
        tutor_profile.verified = not tutor_profile.verified
        tutor_profile.save()
        action = "approved" if tutor_profile.verified else "revoked"
        return Response({"message": f"Tutor {action}.", "verified": tutor_profile.verified})
    except TutorProfile.DoesNotExist:
        return Response({"error": "Tutor profile not found."}, status=404)


@api_view(["DELETE"])
@permission_classes([IsAdminUser])
def delete_user(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        if user.is_superuser:
            return Response({"error": "Cannot delete superuser."}, status=403)
        user.delete()
        return Response({"message": "User deleted."})
    except User.DoesNotExist:
        return Response({"error": "Not found."}, status=404)


@api_view(["GET"])
@permission_classes([IsAdminUser])
def platform_stats(request):
    from lms.djangoapps.sessions.models import TutorSession
    from lms.djangoapps.bookings.models import Booking
    from lms.djangoapps.submissions.models import ContentSubmission
    from lms.djangoapps.payments.models import Payment
    return Response({
        "total_users": User.objects.count(),
        "total_tutors": UserProfile.objects.filter(role="tutor").count(),
        "total_students": UserProfile.objects.filter(role="student").count(),
        "total_kids": UserProfile.objects.filter(role="kid").count(),
        "total_parents": UserProfile.objects.filter(role="parent").count(),
        "total_sessions": TutorSession.objects.count(),
        "total_bookings": Booking.objects.count(),
        "confirmed_bookings": Booking.objects.filter(status="confirmed").count(),
        "pending_submissions": ContentSubmission.objects.filter(status="pending").count(),
        "pending_approvals": TutorProfile.objects.filter(verified=False).count(),
        "total_revenue": sum(
            float(p.amount) for p in Payment.objects.filter(status="completed")
        ),
    })
