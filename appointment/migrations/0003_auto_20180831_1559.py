# Generated by Django 2.1 on 2018-08-31 07:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('appointment', '0002_auto_20180831_0713'),
    ]

    operations = [
        migrations.AlterField(
            model_name='client',
            name='fb_name',
            field=models.CharField(blank=True, max_length=30),
        ),
        migrations.AlterField(
            model_name='client',
            name='fb_profile',
            field=models.CharField(blank=True, max_length=100),
        ),
    ]
