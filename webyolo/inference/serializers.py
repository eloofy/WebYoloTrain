# serializers.py

from rest_framework import serializers
from .models import InferenceTask

class InferenceTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = InferenceTask
        fields = ['id', 'task_id', 'experiment_url', 'zip_filename', 'created_at', "prediction_name", "model_name"]