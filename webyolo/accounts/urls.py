from django.urls import path
from .views import RegisterView, LoginView, TokenByEmailView, ProfileView
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('gettoken/', TokenByEmailView.as_view(), name='gettoken'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('user/profile/', ProfileView.as_view(), name='profile'),

]