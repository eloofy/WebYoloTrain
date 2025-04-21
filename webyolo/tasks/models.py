from django.db import models
from django.contrib.auth import get_user_model
from webyolo.datasets.models import Dataset

User = get_user_model()

# Обновлённые варианты модели – теперь соответствуют вариантам YOLOv8
MODEL_CHOICES = [
    ('yolov8n', 'YOLOv8n (Nano)'),
    ('yolov8s', 'YOLOv8s (Small)'),
    ('yolov8m', 'YOLOv8m (Medium)'),
    ('yolov8l', 'YOLOv8l (Large)'),
    ('yolov8x', 'YOLOv8x (Extra Large)'),
]


STATUS_CHOICES = [
    ('pending', 'Pending'),
    ('running', 'Running'),
    ('completed', 'Completed'),
    ('failed', 'Failed'),
]

class TrainingTask(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='training_tasks')
    model_type = models.CharField(max_length=50, choices=MODEL_CHOICES)
    name_task = models.CharField(max_length=50, default='none')
    config = models.JSONField(default=dict)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    experiment_url = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    dataset_id = models.ForeignKey(Dataset, on_delete=models.CASCADE, related_name="dataset", null=True)
    celery_id = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"{self.owner.nickname} - {self.model_type} - {self.status}"