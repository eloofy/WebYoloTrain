from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Experiment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='experiments')
    project_name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    metrics = models.JSONField()
    model_download_url = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.project_name} - {self.user.username}"
