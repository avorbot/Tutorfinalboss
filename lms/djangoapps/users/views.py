"""Auth API views."""
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from .models import UserProfile


@api_view(["POST"])
@permission_classes([AllowAny])
def api_register(request):
    data = request.data
    name = data.get("name", "").strip()
    email = data.get("email", "").strip()
    password = data.get("password", "")
    role = data.get("role", "student")
    if not name or not email or not password:
        return Response({"error": "Name, email, and password are required."}, status=400)
    if User.objects.filter(email=email).exists():
        return Response({"error": "Email already registered."}, status=400)
    parts = name.split(" ", 1)
    first, last = parts[0], (parts[1] if len(parts) > 1 else "")
    username = email.split("@")[0]
    base, i = username, 1
    while User.objects.filter(username=username).exists():
        username = f"{base}{i}"; i += 1
    user = User.objects.create_user(
        username=username, email=email, first_name=first, last_name=last, password=password
    )
    UserProfile.objects.create(user=user, role=role)
    from lms.djangoapps.tutors.models import TutorProfile
    if role == "tutor":
        TutorProfile.objects.create(user=user)
    refresh = RefreshToken.for_user(user)
    profile = user.profile
    return Response({
        "access": str(refresh.access_token),
        "refresh": str(refresh),
        "user": {"id": user.id, "name": user.get_full_name(), "email": user.email, "role": profile.role},
    }, status=201)


@api_view(["POST"])
@permission_classes([AllowAny])
def api_login(request):
    from django.contrib.auth import authenticate
    email = request.data.get("email", "").strip()
    password = request.data.get("password", "")
    try:
        user_obj = User.objects.get(email=email)
        user = authenticate(request, username=user_obj.username, password=password)
    except User.DoesNotExist:
        user = None
    if not user:
        return Response({"error": "Invalid credentials."}, status=401)
    refresh = RefreshToken.for_user(user)
    profile = getattr(user, "profile", None)
    return Response({
        "access": str(refresh.access_token),
        "refresh": str(refresh),
        "user": {
            "id": user.id, "name": user.get_full_name() or user.username,
            "email": user.email, "role": profile.role if profile else "student",
        },
    })


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def api_logout(request):
    try:
        token = RefreshToken(request.data.get("refresh"))
        token.blacklist()
    except Exception:
        pass
    return Response({"message": "Logged out."})


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def api_me(request):
    user = request.user
    profile = getattr(user, "profile", None)
    return Response({
        "id": user.id, "name": user.get_full_name() or user.username,
        "email": user.email, "role": profile.role if profile else "student",
        "avatar": profile.avatar.url if profile and profile.avatar else None,
        "country": profile.country if profile else "",
        "city": profile.city if profile else "",
        "phone": profile.phone if profile else "",
    })


@api_view(["PUT", "PATCH"])
@permission_classes([IsAuthenticated])
def api_update_profile(request):
    user = request.user
    profile = getattr(user, "profile", None)
    data = request.data
    if "name" in data:
        parts = data["name"].split(" ", 1)
        user.first_name = parts[0]
        user.last_name = parts[1] if len(parts) > 1 else ""
        user.save()
    if profile:
        for field in ["country", "city", "phone", "education_level"]:
            if field in data:
                setattr(profile, field, data[field])
        profile.save()
    return Response({"message": "Profile updated."})
