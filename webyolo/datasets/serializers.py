from rest_framework import serializers
from .models import Dataset, LeaderBoardEntry

class DatasetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dataset
        fields = '__all__'

class LeaderboardEntrySerializer(serializers.ModelSerializer):
    class Meta:
        model = LeaderBoardEntry
        fields = '__all__'