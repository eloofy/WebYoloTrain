from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()

class SendCodeSerializer(serializers.Serializer):
    email = serializers.CharField()

    def validate_email(self, email):
        return email

class VerifyCodeSerializer(serializers.Serializer):
    email = serializers.EmailField()
    code = serializers.CharField(max_length=6)
