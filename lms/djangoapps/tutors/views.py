from django.db.models import Q
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .models import TutorProfile


def _tutor_dict(p):
    return {
        "id": p.user.id, "name": p.user.get_full_name() or p.user.username,
        "email": p.user.email, "bio": p.bio, "subjects": p.subject_list,
        "hourly_rate": float(p.hourly_rate), "currency": p.currency,
        "experience_years": p.experience_years, "rating": p.rating,
        "total_reviews": p.total_reviews, "verified": p.verified,
    }


@api_view(["GET"])
@permission_classes([AllowAny])
def list_tutors(request):
    subject = request.query_params.get("subject", "")
    search = request.query_params.get("search", "")
    profiles = TutorProfile.objects.filter(verified=True).select_related("user")
    if subject:
        profiles = profiles.filter(subjects__icontains=subject)
    if search:
        profiles = profiles.filter(
            Q(user__first_name__icontains=search) | Q(user__last_name__icontains=search)
            | Q(bio__icontains=search) | Q(subjects__icontains=search)
        )
    return Response([_tutor_dict(p) for p in profiles])


@api_view(["GET"])
@permission_classes([AllowAny])
def tutor_detail(request, tutor_id):
    try:
        p = TutorProfile.objects.select_related("user").get(user_id=tutor_id)
    except TutorProfile.DoesNotExist:
        return Response({"error": "Not found."}, status=404)
    data = _tutor_dict(p)
    data["education"] = p.education
    data["availability"] = p.availability
    return Response(data)


@api_view(["GET", "PUT", "PATCH"])
@permission_classes([IsAuthenticated])
def my_tutor_profile(request):
    p = getattr(request.user, "tutor_profile", None)
    if not p:
        return Response({"error": "No tutor profile found."}, status=404)
    if request.method == "GET":
        return Response({**_tutor_dict(p), "education": p.education, "availability": p.availability})
    for field in ["bio", "subjects", "hourly_rate", "currency", "experience_years", "education", "availability"]:
        if field in request.data:
            setattr(p, field, request.data[field])
    p.save()
    return Response({"message": "Profile updated."})
