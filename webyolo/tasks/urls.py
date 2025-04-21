from django.urls import path
from .views import TrainingTaskCreateView, TrainingTaskListView, TrainingTaskStopView, TrainingTaskDeleteView

urlpatterns = [
    path('createtask/', TrainingTaskCreateView.as_view(), name='taksk_create'),
    path('gettasks/', TrainingTaskListView.as_view(), name='task_list'),
    path('stoptask/', TrainingTaskStopView.as_view(), name='task_stop'),
    path('deletetask/<int:task_id>/', TrainingTaskDeleteView.as_view(), name='delete-task'),
]