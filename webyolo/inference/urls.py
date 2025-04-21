from django.urls import path
from .views import InferenceFromTaskView, InferenceDownloadView, InferenceTaskListView, InferenceTaskDeleteView

urlpatterns = [
    path("make-inference/", InferenceFromTaskView.as_view(), name="yolov8-inference"),
    path('download/<str:filename>/', InferenceDownloadView.as_view(), name='inference-download'),
    path('history/', InferenceTaskListView.as_view(), name='inference-history'),
    path('delete/<uuid:pk>/', InferenceTaskDeleteView.as_view(), name='inference-delete'),
]