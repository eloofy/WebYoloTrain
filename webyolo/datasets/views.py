from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Dataset, LeaderBoardEntry
from .serializers import DatasetSerializer, LeaderboardEntrySerializer
import os
from django.conf import settings
from urllib.parse import urljoin
from rest_framework import filters

class DatasetsListView(generics.ListAPIView):
    serializer_class = DatasetSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ['name', 'create_at']  # Укажите нужные поля для сортировки, если нужно

    def get_queryset(self):
        queryset = Dataset.objects.filter(owner=self.request.user) # Базовый запрос ко всем датасетам

        # Проверка, если в запросе есть параметр "is_public"
        is_public = self.request.query_params.get('is_public', None)
        if is_public is not None:
            # Фильтруем по полю is_public (True/False)
            is_public = is_public.lower() in ['true', '1', 't', 'y', 'yes']
            queryset = queryset.filter(is_public=is_public)

        return queryset

class LeaderBoardListView(generics.ListAPIView):
    queryset = LeaderBoardEntry.objects.all()
    serializer_class = LeaderboardEntrySerializer
    permission_classes = [permissions.IsAuthenticated]

class UploadDatasetView(APIView):
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
        dataset_name = request.data.get('name')
        files = request.FILES.getlist('files')
        paths = request.data.getlist('paths')
        description = request.data.get('description')

        if not dataset_name:
            return Response({'error': 'Dataset name is required'}, status=status.HTTP_400_BAD_REQUEST)

        dataset_dir = os.path.join(settings.MEDIA_ROOT, 'datasets', dataset_name)
        os.makedirs(dataset_dir, exist_ok=True)

        for i, file in enumerate(files):
            rel_path = paths[i]
            rel_path = rel_path.lstrip("/")
            rel_path = '/'.join(rel_path.split("/")[1:])

            save_path = os.path.join(dataset_dir, rel_path)
            save_dir = os.path.dirname(save_path)
            os.makedirs(save_dir, exist_ok=True)

            try:
                with open(save_path, 'wb+') as destination:
                    for chunk in file.chunks():
                        destination.write(chunk)
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        try:
            dataset = Dataset.objects.create(
                name=dataset_name,
                file=dataset_dir,
                description=description,
                owner=request.user  # добавляем владельца
            )
        except Exception as e:
            return Response({'error': 'Failed to create dataset record: ' + str(e)},
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({'message': f'{len(files)} файлов загружено в {dataset_name}',
                         'dataset_id': dataset.id},
                        status=status.HTTP_200_OK)

class DatasetImagesView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, dataset_id):
        dataset = Dataset.objects.filter(id=dataset_id).first()
        if not dataset:
            return Response({'error': 'Dataset not found'}, status=status.HTTP_404_NOT_FOUND)

        base_path = dataset.file.path

        image_dir = os.path.join(base_path, 'train', 'images')
        label_dir = os.path.join(base_path, 'train', 'labels')

        if not os.path.exists(image_dir) and not os.path.exists(label_dir):
            return Response({'error': 'Missing image or label folder'}, status=404)

        image_files = sorted([
            f for f in os.listdir(image_dir)
            if f.lower().endswith(('.jpg', '.jpeg', '.png'))
        ])[:7]

        response_data = []

        for img_name in image_files:
            label_name = os.path.splitext(img_name)[0] + '.txt'

            image_url = request.build_absolute_uri(
                urljoin(settings.MEDIA_URL, f'datasets/{dataset.name}/train/images/{img_name}')
            )
            label_url = request.build_absolute_uri(
                urljoin(settings.MEDIA_URL, f'datasets/{dataset.name}/train/labels/{label_name}')
            )

            response_data.append({
                'image_url': image_url,
                'label_url': label_url
            })

        # Подсчёт файлов в train/valid/test
        def count_images(split):
            dir_path = os.path.join(base_path, split, 'images')
            if os.path.exists(dir_path):
                return len([
                    f for f in os.listdir(dir_path)
                    if f.lower().endswith(('.jpg', '.jpeg', '.png'))
                ])
            return 0

        counts = {
            'train': count_images('train'),
            'valid': count_images('valid'),
            'test': count_images('test'),
        }

        return Response({
            'items': response_data,
            'counts': counts
        }, status=200)

    def delete(self, request, dataset_id):
        dataset = Dataset.objects.filter(id=dataset_id).first()
        if not dataset:
            return Response({'error': 'Dataset not found'}, status=404)

        try:
            import shutil
            shutil.rmtree(dataset.file.path, ignore_errors=True)
        except Exception as e:
            print('Failed to delete files:', e)

        dataset.delete()
        return Response({'message': 'Dataset deleted successfully'}, status=200)

    def patch(self, request, dataset_id):
        dataset = Dataset.objects.filter(id=dataset_id).first()
        if not dataset:
            return Response({'error': 'Dataset not found'}, status=status.HTTP_404_NOT_FOUND)

        name = request.data.get('name')
        description = request.data.get('description')
        is_public = request.data.get('is_public')

        if name is not None:
            # Сохраняем старое имя для переименования папки
            old_name = dataset.name
            dataset.name = name

            # Формируем абсолютные пути для старой и новой папок
            base_path = f"{settings.MEDIA_ROOT}/datasets"  # убедитесь, что этот параметр определён в настройках
            old_folder_path = os.path.join(base_path, old_name)
            new_folder_path = os.path.join(base_path, name)

            # Проверяем, существует ли старая папка
            if os.path.exists(old_folder_path):
                try:
                    os.rename(old_folder_path, new_folder_path)
                    dataset.file = new_folder_path
                except Exception as e:
                    return Response(
                        {'error': f'Ошибка при переименовании папки: {str(e)}'},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR
                    )
            else:
                # Если старая папка не существует, можно создать новую
                try:
                    os.makedirs(new_folder_path)
                except Exception as e:
                    return Response(
                        {'error': f'Ошибка при создании новой папки: {str(e)}'},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR
                    )

        if description is not None:
            dataset.description = description

        if is_public is not None:
            if is_public == dataset.is_public:
                return Response({'message': 'Already public'}, status=status.HTTP_200_OK)
            dataset.is_public = is_public

        dataset.save()
        return Response({
            'id': dataset.id,
            'name': dataset.name,
            'description': dataset.description,
        }, status=status.HTTP_200_OK)