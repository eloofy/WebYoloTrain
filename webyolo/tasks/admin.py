from django.contrib import admin
from .models import TrainingTask

class TrainingTaskAdmin(admin.ModelAdmin):
    list_display = ['user', 'model_type', 'server_type', 'status', 'created_at']
    list_filter = ['status', 'model_type', 'server_type']
    search_fields = ['user__username', 'model_type', 'status']

admin.site.register(TrainingTask, TrainingTaskAdmin)
