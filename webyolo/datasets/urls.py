from django.urls import path
from .views import DatasetsListView, LeaderBoardListView

urlpatterns = [
    path('datasets/', DatasetsListView.as_view(), name='dataset_list'),
    path('leaderboard', LeaderBoardListView.as_view(), name='leaderboard')
]