from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Booking
from lms.djangoapps.sessions.models import TutorSession


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_bookings(request):
    bookings = Booking.objects.filter(student=request.user).select_related(
        "session", "session__tutor"
    ).order_by("-created_at")
    return Response([{
        "id": b.id,
        "session": {"id": b.session.id, "title": b.session.title, "subject": b.session.subject},
        "tutor": {"name": b.session.tutor.get_full_name() or b.session.tutor.username},
        "scheduled_at": b.scheduled_at, "status": b.status,
        "payment_status": b.payment_status, "amount_paid": float(b.amount_paid),
    } for b in bookings])


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_booking(request):
    d = request.data
    try:
        session = TutorSession.objects.get(id=d.get("session_id"), status="active")
    except TutorSession.DoesNotExist:
        return Response({"error": "Session not found or not active."}, status=404)
    booking = Booking.objects.create(
        student=request.user, session=session,
        scheduled_at=d.get("scheduled_at"),
        notes=d.get("notes", ""),
    )
    return Response({"id": booking.id, "status": booking.status}, status=201)


@api_view(["GET", "PUT", "PATCH", "DELETE"])
@permission_classes([IsAuthenticated])
def booking_detail(request, booking_id):
    try:
        booking = Booking.objects.get(id=booking_id, student=request.user)
    except Booking.DoesNotExist:
        return Response({"error": "Not found."}, status=404)
    if request.method == "DELETE":
        booking.status = "cancelled"
        booking.save()
        return Response({"message": "Booking cancelled."})
    if request.method in ("PUT", "PATCH"):
        if "status" in request.data:
            booking.status = request.data["status"]
            booking.save()
        return Response({"message": "Updated."})
    return Response({
        "id": booking.id,
        "session": {"id": booking.session.id, "title": booking.session.title},
        "scheduled_at": booking.scheduled_at, "status": booking.status,
        "payment_status": booking.payment_status, "notes": booking.notes,
    })


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def tutor_bookings(request):
    bookings = Booking.objects.filter(session__tutor=request.user).select_related(
        "student", "session"
    ).order_by("scheduled_at")
    return Response([{
        "id": b.id, "student_name": b.student.get_full_name() or b.student.username,
        "session_title": b.session.title,
        "scheduled_at": b.scheduled_at, "status": b.status,
        "payment_status": b.payment_status,
    } for b in bookings])
