from django.urls import path
from .views import ExperimentListView

urlpatterns = [
    path('', ExperimentListView.as_view(), name='experiment_list')
]