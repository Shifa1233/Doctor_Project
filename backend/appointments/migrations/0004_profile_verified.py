# Generated by Django 5.1.7 on 2025-03-19 08:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('appointments', '0003_profile_delete_patient'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='verified',
            field=models.BooleanField(default=False),
        ),
    ]
