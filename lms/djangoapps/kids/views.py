from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import KidsAccount, KidsProgress


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_kids(request):
    p = getattr(request.user, "parent_profile", None)
    if not p:
        return Response([])
    kids = KidsAccount.objects.filter(parent=p)
    return Response([{
        "id": k.id, "name": k.name, "age": k.age, "avatar_id": k.avatar_id,
        "points": k.points, "level": k.level, "badges": k.badges,
        "favourite_color": k.favourite_color,
    } for k in kids])


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_kid(request):
    p = getattr(request.user, "parent_profile", None)
    if not p:
        return Response({"error": "Parent profile not found."}, status=404)
    d = request.data
    kid = KidsAccount.objects.create(
        parent=p, name=d.get("name", ""), age=d.get("age", 5),
        avatar_id=d.get("avatar_id", "1"),
        favourite_color=d.get("favourite_color", "green"),
    )
    return Response({"id": kid.id, "name": kid.name}, status=201)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def kid_progress(request, kid_id):
    p = getattr(request.user, "parent_profile", None)
    try:
        kid = KidsAccount.objects.get(id=kid_id, parent=p)
    except KidsAccount.DoesNotExist:
        return Response({"error": "Not found."}, status=404)
    progress = KidsProgress.objects.filter(kid=kid)
    return Response({
        "kid": {"id": kid.id, "name": kid.name, "level": kid.level, "points": kid.points, "badges": kid.badges},
        "progress": [{"subject": pr.subject, "lessons_completed": pr.lessons_completed,
                      "stars": pr.stars, "last_activity": pr.last_activity} for pr in progress],
    })


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def update_kid_progress(request, kid_id):
    p = getattr(request.user, "parent_profile", None)
    try:
        kid = KidsAccount.objects.get(id=kid_id, parent=p)
    except KidsAccount.DoesNotExist:
        return Response({"error": "Not found."}, status=404)
    d = request.data
    pr, _ = KidsProgress.objects.get_or_create(kid=kid, subject=d.get("subject", "general"))
    pr.lessons_completed += 1
    pr.stars = max(pr.stars, d.get("stars", 0))
    pr.save()
    kid.points += 10
    if kid.points >= kid.level * 100:
        kid.level += 1
    kid.save()
    return Response({"points": kid.points, "level": kid.level})
