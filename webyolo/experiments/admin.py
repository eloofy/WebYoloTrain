from django.contrib import admin
from .models import Experiment

class ExperimentAdmin(admin.ModelAdmin):
    list_display = ['user', 'project_name', 'description', 'metrics', 'model_download_url', 'created_at']
    list_filter = ['created_at',]
    search_fields = ['project_name', 'created_at']

admin.site.register(Experiment, ExperimentAdmin)