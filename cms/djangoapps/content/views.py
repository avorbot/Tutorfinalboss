"""CMS content library views."""
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework.response import Response

from lms.djangoapps.submissions.models import ContentSubmission


@api_view(["GET"])
@permission_classes([AllowAny])
def content_library(request):
    approved = ContentSubmission.objects.filter(status="approved").select_related("submitted_by")
    content_type = request.query_params.get("type")
    if content_type:
        approved = approved.filter(content_type=content_type)
    return Response([{
        "id": s.id, "title": s.title, "content_type": s.content_type,
        "description": s.description, "content": s.content,
        "author": s.submitted_by.get_full_name() or s.submitted_by.email,
        "created_at": s.created_at,
    } for s in approved])


@api_view(["GET"])
@permission_classes([IsAdminUser])
def pending_review(request):
    pending = ContentSubmission.objects.filter(status="pending").select_related("submitted_by")
    return Response([{
        "id": s.id, "title": s.title, "content_type": s.content_type,
        "direction": s.direction,
        "author": s.submitted_by.get_full_name() or s.submitted_by.email,
        "description": s.description, "created_at": s.created_at,
    } for s in pending])
