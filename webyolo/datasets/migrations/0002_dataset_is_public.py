# Generated by Django 5.1.7 on 2025-04-08 10:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('datasets', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='dataset',
            name='is_public',
            field=models.BooleanField(default=False),
        ),
    ]
