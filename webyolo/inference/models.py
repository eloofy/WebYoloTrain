import uuid
from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class InferenceTask(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='inference_tasks')
    experiment_url = models.URLField()
    task_id = models.CharField(max_length=255)
    prediction_name = models.CharField(max_length=255, blank=True, null=True)  # ✅ добавлено
    created_at = models.DateTimeField(auto_now_add=True)
    zip_filename = models.CharField(max_length=255, blank=True, null=True)
    model_name = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"Inference {self.task_id} by {self.user}"


class InferenceResult(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    task = models.ForeignKey(InferenceTask, on_delete=models.CASCADE, related_name='results')
    original_filename = models.CharField(max_length=255)
    result_image_path = models.CharField(max_length=1024)  # путь к сохранённому файлу
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Result for {self.original_filename} (task {self.task_id})"