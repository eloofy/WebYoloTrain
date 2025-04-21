from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from webyolo.celery_app import app as celery_app

from .serializers import TrainingTaskSerializer
from webyolo.datasets.models import Dataset
from .models import TrainingTask
from modeling_yolov8.create_task import run_yolov8_training


class TrainingTaskCreateView(APIView):
    serializer_class = TrainingTaskSerializer

    def post(self, request):
        model_type = request.data.get("model_type")
        name_task = request.data.get("task_title")
        description = request.data.get("description")
        config = request.data.get("config")
        dataset_id = request.data.get("dataset_id")["id"]
        dataset = Dataset.objects.get(id=dataset_id)


        try:
            task = TrainingTask.objects.create(
                model_type=model_type,
                name_task=name_task,
                description=description,
                config=config,
                status="pending",
                owner=request.user,
                dataset_id=dataset,
            )
        except Exception as e:
            print(e)
            return Response(
                {'error': 'Failed to create task: ' + str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        async_result = run_yolov8_training.delay(task.id)
        task.celery_id = async_result.id
        task.save()


        return Response({"ok": True}, status=status.HTTP_200_OK)


class TrainingTaskListView(generics.ListAPIView):
    serializer_class = TrainingTaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Фильтруем задачи по пользователю, который их создал.
        return TrainingTask.objects.filter(owner=self.request.user)

class TrainingTaskDeleteView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, task_id):
        try:
            task = TrainingTask.objects.get(id=task_id, owner=request.user)
        except TrainingTask.DoesNotExist:
            return Response({"error": "Task not found."}, status=status.HTTP_404_NOT_FOUND)

        task.delete()
        return Response({"ok": True, "message": "Task deleted successfully."}, status=status.HTTP_200_OK)


class TrainingTaskStopView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        task_id = request.data.get("task_id")
        if not task_id:
            return Response({"error": "Task ID is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            task = TrainingTask.objects.get(id=task_id, owner=request.user)
        except TrainingTask.DoesNotExist:
            return Response({"error": "Task not found."}, status=status.HTTP_404_NOT_FOUND)

        if not task.celery_id:
            return Response({"error": "Celery task ID not found."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Вызываем revoke для остановки задачи (terminate=True посылает сигнал SIGTERM)
            celery_app.control.revoke(task.celery_id, terminate=True, signal='SIGTERM')
        except Exception as e:
            return Response({"error": f"Failed to stop task: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        task.status = "stopped"
        task.save()
        return Response({"message": "Task stopped successfully."}, status=status.HTTP_200_OK)