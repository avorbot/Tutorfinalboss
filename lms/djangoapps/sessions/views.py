from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .models import TutorSession, Enrollment


def _session_dict(s, include_tutor=True):
    d = {
        "id": s.id, "title": s.title, "subject": s.subject,
        "description": s.description, "price": float(s.price),
        "currency": s.currency, "duration": s.duration,
        "session_type": s.session_type, "max_students": s.max_students,
        "status": s.status, "created_at": s.created_at,
        "enrollment_count": s.enrollments.filter(status="active").count(),
    }
    if include_tutor:
        d["tutor"] = {"id": s.tutor.id, "name": s.tutor.get_full_name() or s.tutor.username}
    return d


@api_view(["GET"])
@permission_classes([AllowAny])
def list_sessions(request):
    sessions = TutorSession.objects.filter(status="active").select_related("tutor")
    subject = request.query_params.get("subject")
    if subject:
        sessions = sessions.filter(subject__icontains=subject)
    return Response([_session_dict(s) for s in sessions])


@api_view(["GET"])
@permission_classes([AllowAny])
def session_detail(request, session_id):
    try:
        s = TutorSession.objects.select_related("tutor").get(id=session_id)
    except TutorSession.DoesNotExist:
        return Response({"error": "Not found."}, status=404)
    return Response(_session_dict(s))


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_session(request):
    d = request.data
    s = TutorSession.objects.create(
        tutor=request.user, title=d.get("title", ""),
        subject=d.get("subject", ""), description=d.get("description", ""),
        price=d.get("price", 0), currency=d.get("currency", "UGX"),
        duration=d.get("duration", 60), max_students=d.get("max_students", 1),
        session_type=d.get("session_type", "one-on-one"),
    )
    return Response({"id": s.id, "title": s.title}, status=201)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_sessions(request):
    sessions = TutorSession.objects.filter(tutor=request.user).order_by("-created_at")
    return Response([_session_dict(s, include_tutor=False) for s in sessions])


@api_view(["GET", "PUT", "PATCH", "DELETE"])
@permission_classes([IsAuthenticated])
def session_manage(request, session_id):
    try:
        s = TutorSession.objects.get(id=session_id, tutor=request.user)
    except TutorSession.DoesNotExist:
        return Response({"error": "Not found."}, status=404)
    if request.method == "DELETE":
        s.delete()
        return Response({"message": "Deleted."})
    if request.method == "GET":
        return Response(_session_dict(s, include_tutor=False))
    for field in ["title", "subject", "description", "price", "currency", "duration", "max_students", "session_type", "status"]:
        if field in request.data:
            setattr(s, field, request.data[field])
    s.save()
    return Response({"message": "Updated."})
