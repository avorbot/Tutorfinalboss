from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import ParentProfile
from lms.djangoapps.kids.models import KidsAccount


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def parent_profile(request):
    if request.method == "GET":
        p = getattr(request.user, "parent_profile", None)
        if not p:
            return Response({"error": "Not found."}, status=404)
        kids = KidsAccount.objects.filter(parent=p)
        return Response({"id": p.id, "kids_count": kids.count()})
    pin = request.data.get("pin", "")
    if len(str(pin)) < 4:
        return Response({"error": "PIN must be at least 4 digits."}, status=400)
    p, created = ParentProfile.objects.get_or_create(
        user=request.user, defaults={"pin": str(pin)}
    )
    if not created:
        return Response({"error": "Parent profile already exists."}, status=400)
    from lms.djangoapps.users.models import UserProfile
    profile = getattr(request.user, "profile", None)
    if profile:
        profile.role = "parent"
        profile.save()
    return Response({"id": p.id, "message": "Parent profile created."}, status=201)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def verify_pin(request):
    p = getattr(request.user, "parent_profile", None)
    if not p:
        return Response({"error": "No parent profile."}, status=404)
    if p.pin == str(request.data.get("pin", "")):
        return Response({"valid": True})
    return Response({"valid": False}, status=401)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_kids(request):
    p = getattr(request.user, "parent_profile", None)
    if not p:
        return Response([])
    kids = KidsAccount.objects.filter(parent=p)
    return Response([{
        "id": k.id, "name": k.name, "age": k.age,
        "points": k.points, "level": k.level,
    } for k in kids])
