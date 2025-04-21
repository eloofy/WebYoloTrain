from django.urls import path
from .views import SendCodeView, VerifyCodeView, CheckEmailView

urlpatterns = [
    path('sendcode/', SendCodeView.as_view(), name='sendcode'),
    path('verifycode/', VerifyCodeView.as_view(), name='verifycode'),
    path('check-email/', CheckEmailView.as_view(), name='check-email'),
]