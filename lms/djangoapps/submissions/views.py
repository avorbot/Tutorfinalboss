from django.utils import timezone
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response

from .models import ContentSubmission


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def submissions(request):
    if request.method == "GET":
        subs = ContentSubmission.objects.filter(submitted_by=request.user).order_by("-created_at")
        return Response([{
            "id": s.id, "title": s.title, "status": s.status,
            "content_type": s.content_type, "created_at": s.created_at,
            "review_note": s.review_note,
        } for s in subs])
    d = request.data
    sub = ContentSubmission.objects.create(
        submitted_by=request.user,
        title=d.get("title", ""), content=d.get("content", ""),
        description=d.get("description", ""),
        content_type=d.get("type", "article"),
        direction=d.get("direction", "lms_to_cms"),
    )
    return Response({"id": sub.id, "title": sub.title, "status": sub.status}, status=201)


@api_view(["GET"])
@permission_classes([IsAdminUser])
def pending_submissions(request):
    subs = ContentSubmission.objects.filter(status="pending").select_related("submitted_by")
    return Response([{
        "id": s.id, "title": s.title, "content_type": s.content_type,
        "submitted_by": s.submitted_by.get_full_name() or s.submitted_by.email,
        "direction": s.direction, "created_at": s.created_at,
    } for s in subs])


@api_view(["POST"])
@permission_classes([IsAdminUser])
def review_submission(request, submission_id):
    try:
        sub = ContentSubmission.objects.get(id=submission_id)
    except ContentSubmission.DoesNotExist:
        return Response({"error": "Not found."}, status=404)
    action = request.data.get("action")
    if action not in ("approve", "reject"):
        return Response({"error": "action must be approve or reject."}, status=400)
    sub.status = "approved" if action == "approve" else "rejected"
    sub.review_note = request.data.get("note", "")
    sub.reviewed_by = request.user
    sub.reviewed_at = timezone.now()
    sub.save()
    return Response({"status": sub.status})
