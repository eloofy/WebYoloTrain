from django.contrib import admin
from .models import TrainingTask

class TrainingTaskAdmin(admin.ModelAdmin):
    list_display = ['owner', 'model_type', 'status', 'created_at']
    list_filter = ['status', 'model_type',]
    search_fields = ['owner__nickname', 'model_type', 'status']

# admin.site.register(TrainingTask, TrainingTaskAdmin)
