# Generated by Django 2.1 on 2018-09-01 05:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('appointment', '0003_auto_20180831_1559'),
    ]

    operations = [
        migrations.AddField(
            model_name='appointmentservice',
            name='is_free',
            field=models.BooleanField(default=False),
        ),
    ]