from rest_framework import serializers
from .models import TrainingTask

class TrainingTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrainingTask
        fields = '__all__'