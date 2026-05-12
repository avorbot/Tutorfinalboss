from django.contrib.auth.models import User
from django.db.models import Q
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Message


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_conversations(request):
    user = request.user
    msgs = Message.objects.filter(Q(sender=user) | Q(receiver=user)).select_related("sender", "receiver")
    partner_ids = set()
    for m in msgs:
        partner_ids.add(m.receiver_id if m.sender == user else m.sender_id)
    result = []
    for pid in partner_ids:
        try:
            partner = User.objects.get(id=pid)
            last = Message.objects.filter(
                Q(sender=user, receiver=partner) | Q(sender=partner, receiver=user)
            ).order_by("-created_at").first()
            unread = Message.objects.filter(sender=partner, receiver=user, read=False).count()
            result.append({
                "partner_id": partner.id,
                "partner_name": partner.get_full_name() or partner.username,
                "last_message": last.content[:80] if last else "",
                "last_at": last.created_at if last else None,
                "unread": unread,
            })
        except User.DoesNotExist:
            pass
    result.sort(key=lambda x: str(x.get("last_at") or ""), reverse=True)
    return Response(result)


@api_view(["GET", "POST"])
@permission_classes([IsAuthenticated])
def conversation(request, partner_id):
    user = request.user
    try:
        partner = User.objects.get(id=partner_id)
    except User.DoesNotExist:
        return Response({"error": "User not found."}, status=404)
    if request.method == "POST":
        content = request.data.get("content", "").strip()
        if not content:
            return Response({"error": "Content is required."}, status=400)
        msg = Message.objects.create(sender=user, receiver=partner, content=content)
        return Response({"id": msg.id, "content": msg.content, "created_at": msg.created_at}, status=201)
    Message.objects.filter(sender=partner, receiver=user, read=False).update(read=True)
    messages = Message.objects.filter(
        Q(sender=user, receiver=partner) | Q(sender=partner, receiver=user)
    ).order_by("created_at")
    return Response([{
        "id": m.id, "content": m.content,
        "sent_by_me": m.sender_id == user.id,
        "created_at": m.created_at, "read": m.read,
    } for m in messages])
