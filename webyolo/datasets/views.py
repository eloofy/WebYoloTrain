from rest_framework import generics, permissions
from .models import Dataset, LeaderBoardEntry
from .serializers import DatasetSerializer, LeaderboardEntrySerializer

class DatasetsListView(generics.ListAPIView):
    queryset = Dataset.objects.all()
    serializer_class = DatasetSerializer
    permission_classes = [permissions.AllowAny]

class LeaderBoardListView(generics.ListAPIView):
    queryset = LeaderBoardEntry.objects.all()
    serializer_class = LeaderboardEntrySerializer
    permission_classes = [permissions.AllowAny]

