from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Dataset(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    file = models.FileField(upload_to='datasets/')
    create_at = models.DateTimeField(auto_now_add=True)
    is_public = models.BooleanField(default=False)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='datasets', null=True)

    def __str__(self):
        return self.name

class LeaderBoardEntry(models.Model):
    dataset = models.ForeignKey(Dataset, on_delete=models.CASCADE, related_name="leaderboard_entries")
    model_name = models.CharField(max_length=100)
    score = models.FloatField()
    submitted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.model_name} - {self.score}"
