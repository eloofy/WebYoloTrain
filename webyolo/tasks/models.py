from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

MODEL_CHOICES = [
    ('resnet', 'ResNet'),
    ('vgg', 'VGG'),
    ('inception', 'Inception'),
]

SERVER_CHOICES = [
    ('small', 'Small'),
    ('medium', 'Medium'),
    ('large', 'Large'),
]

STATUS_CHOICES = [
    ('pending', 'Pending'),
    ('running', 'Running'),
    ('completed', 'Completed'),
    ('failed', 'Failed'),
]

class TrainingTask(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='training_tasks')
    model_type = models.CharField(max_length=50, choices=MODEL_CHOICES)
    config = models.JSONField(default=dict)
    server_type = models.CharField(max_length=20, choices=SERVER_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.model_type} - {self.status}"