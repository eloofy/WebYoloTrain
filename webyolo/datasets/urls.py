from django.urls import path
from .views import DatasetsListView, LeaderBoardListView, UploadDatasetView
from .views import DatasetImagesView

urlpatterns = [
    path('getdatasets/', DatasetsListView.as_view(), name='dataset_list'),
    path('leaderboard', LeaderBoardListView.as_view(), name='leaderboard'),
    path('upload-dataset/', UploadDatasetView.as_view(), name='upload-dataset'),
    path('<int:dataset_id>/images/', DatasetImagesView.as_view(), name='dataset-images'),
]