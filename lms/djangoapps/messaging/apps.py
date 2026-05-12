from django.apps import AppConfig

class MessagingConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "lms.djangoapps.messaging"
    label = "lms_messaging"
