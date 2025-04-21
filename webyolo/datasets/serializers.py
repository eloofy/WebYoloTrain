from rest_framework import serializers
from .models import Dataset, LeaderBoardEntry

class DatasetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dataset
        fields = ['id', 'name', 'description', 'file', 'create_at', 'is_public']

class LeaderboardEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = LeaderBoardEntry
        fields = '__all__'