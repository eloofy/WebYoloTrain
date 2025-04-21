from rest_framework import serializers
from .models import TrainingTask

class TrainingTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrainingTask
        fields = ["model_type", "config", "status", "created_at", "name_task", "experiment_url", "id"]