from django.shortcuts import render
from rest_framework import generics, permissions
from .models import TrainingTask
from .serializers import TrainingTaskSerializer

class TrainingTaskCreate(generics.ListCreateAPIView):
    serializer_class = TrainingTaskSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class TrainingTaskListView(generics.ListAPIView):
    serializer_class = TrainingTaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return TrainingTask.objects.filter(user=self.request.user)
