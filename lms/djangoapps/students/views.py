from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import StudentProfile


@api_view(["GET", "PUT"])
@permission_classes([IsAuthenticated])
def student_profile(request):
    p = getattr(request.user, "student_profile", None)
    if request.method == "PUT":
        if not p:
            p = StudentProfile.objects.create(user=request.user)
        p.level = request.data.get("level", p.level)
        p.interests = request.data.get("interests", p.interests)
        p.save()
        return Response({"message": "Updated."})
    return Response({"level": p.level if p else "", "interests": p.interests if p else ""})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_bookings(request):
    from lms.djangoapps.bookings.models import Booking
    bookings = Booking.objects.filter(student=request.user).select_related(
        "session", "session__tutor"
    ).order_by("-created_at")
    return Response([{
        "id": b.id, "session_title": b.session.title,
        "tutor_name": b.session.tutor.get_full_name() or b.session.tutor.username,
        "scheduled_at": b.scheduled_at, "status": b.status,
        "payment_status": b.payment_status,
    } for b in bookings])
