# experiments/views.py
from rest_framework import generics, permissions
from .models import Experiment
from .serializers import ExperimentSerializer

class ExperimentListView(generics.ListAPIView):
    serializer_class = ExperimentSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return Experiment.objects.filter(user=self.request.user)

class ExperimentDetailView(generics.RetrieveAPIView):
    serializer_class = ExperimentSerializer
    permission_classes = [permissions.AllowAny]
    queryset = Experiment.objects.all()
