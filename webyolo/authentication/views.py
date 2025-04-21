from rest_framework.views import APIView
from rest_framework import generics
from .serializers import SendCodeSerializer
from .utils import generate_code, send_verification_email
from rest_framework.response import Response
from rest_framework import status
from django.core.cache import cache
from rest_framework.permissions import AllowAny
from django.contrib.auth import get_user_model

User = get_user_model()

class SendCodeView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = SendCodeSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        email = request.data.get("email")
        code = generate_code()
        cache.set(f"code:{email}", code, timeout=300)

        send_verification_email(email, code)

        return Response({'detail': 'Код отправлен на email.'}, status=status.HTTP_200_OK)

class VerifyCodeView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        code = request.data.get("code")

        if not code:
            return Response({'detail': 'No code'}, status=status.HTTP_400_BAD_REQUEST)

        cached_code = cache.get(f"code:{email}")

        if cached_code is None:
            return Response({'detail': 'Repeat request code'}, status=status.HTTP_400_BAD_REQUEST)

        if str(code) != str(cached_code):
            return Response({'detail': 'Bad code'}, status=status.HTTP_400_BAD_REQUEST)

        return Response({'detail': 'Success code check'}, status=status.HTTP_200_OK)

class CheckEmailView(generics.GenericAPIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        email = request.data.get("email")
        if not email:
            return Response({"detail": "Email is required"}, status=400)

        exists = User.objects.filter(email=email).exists()
        return Response({"exists": exists}, status=200)



