import uuid
import zipfile
import os
import tempfile
from PIL import Image
from clearml import Task as ClearMLTask
from ultralytics import YOLO

from django.http import FileResponse, Http404
from rest_framework.views import APIView
from rest_framework import permissions, status
from rest_framework.response import Response

from .models import InferenceTask, InferenceResult
from rest_framework.generics import ListAPIView
from .serializers import InferenceTaskSerializer


class InferenceFromTaskView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        experiment_url = request.data.get("experiment_url")
        images = request.FILES.getlist("images[]")

        if not experiment_url or not images:
            return Response(
                {'error': 'experiment_url and images[] are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # 1. task_id из URL
            task_id = self.extract_task_id(experiment_url)

            # 2. загрузка модели из ClearML
            task = ClearMLTask.get_task(task_id=task_id)
            model_path = task.models['output'][0].get_local_copy()
            model = YOLO(model_path)

            # 3. временная директория для инференса
            temp_dir = tempfile.mkdtemp()
            prediction_name = request.data.get("prediction_name", "").strip()
            model_name = task.name

            # 4. создаём задачу инференса в БД
            inference_task = InferenceTask.objects.create(
                user=request.user,
                experiment_url=experiment_url,
                task_id=task_id,
                prediction_name=prediction_name,
                model_name=model_name
            )

            # 5. обрабатываем изображения
            for img_file in images:
                image = Image.open(img_file).convert("RGB")
                results = model(image)

                result_filename = f"{os.path.splitext(img_file.name)[0]}_pred.jpg"
                result_path = os.path.join(temp_dir, result_filename)
                results[0].save(filename=result_path)

                # сохраняем результат
                InferenceResult.objects.create(
                    task=inference_task,
                    original_filename=img_file.name,
                    result_image_path=result_path
                )

            # 6. создаём zip-архив
            zip_filename = f"inference_results_{uuid.uuid4().hex}.zip"
            zip_path = os.path.join(tempfile.gettempdir(), zip_filename)

            with zipfile.ZipFile(zip_path, 'w') as zipf:
                for fname in os.listdir(temp_dir):
                    zipf.write(os.path.join(temp_dir, fname), arcname=fname)

            # 7. обновляем zip-файл в БД
            inference_task.zip_filename = zip_filename
            inference_task.save()

            # 8. ответ клиенту
            return Response({
                "download_url": f"/api/inference/download/{zip_filename}"
            })

        except Exception as e:
            print(e)
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def extract_task_id(self, url: str) -> str:
        """
        Получить task_id из URL вида https://app.clear.ml/projects/xxx/experiments/abc1234567890abcde
        """
        parts = url.rstrip('/').split('/')
        if 'experiments' in parts:
            index = parts.index('experiments')
            if index + 1 < len(parts):
                return parts[index + 1]
        raise ValueError("Invalid experiment URL")


class InferenceDownloadView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, filename):
        zip_path = os.path.join(tempfile.gettempdir(), filename)

        if not os.path.exists(zip_path):
            raise Http404("Файл не найден")

        return FileResponse(
            open(zip_path, 'rb'),
            as_attachment=True,
            filename=filename,
            content_type='application/zip'
        )


class InferenceTaskListView(ListAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = InferenceTaskSerializer

    def get_queryset(self):
        return InferenceTask.objects.filter(user=self.request.user).order_by('-created_at')

class InferenceTaskDeleteView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, pk):
        try:
            task = InferenceTask.objects.get(pk=pk, user=request.user)
            task.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except InferenceTask.DoesNotExist:
            return Response({'error': 'Not found'}, status=status.HTTP_404_NOT_FOUND)