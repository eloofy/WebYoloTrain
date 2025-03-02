from django.contrib import admin
from .models import Dataset, LeaderBoardEntry

class DatasetAdmin(admin.ModelAdmin):
    list_display = ['name', 'description', 'file', 'create_at']
    list_filter = ['name', 'create_at',]
    search_fields = ['name', 'create_at']

class LeaderBoardAdmin(admin.ModelAdmin):
    list_display = ['dataset__name', 'model_name', 'score', 'submitted_at']
    list_filter = ['score', 'model_name', 'submitted_at']
    search_fields = ['dataset__name']

admin.site.register(Dataset, DatasetAdmin)
admin.site.register(LeaderBoardEntry, LeaderBoardAdmin)
