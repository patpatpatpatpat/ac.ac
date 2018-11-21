# Generated by Django 2.1.3 on 2018-11-21 11:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('appointment', '0010_auto_20181108_1218'),
    ]

    operations = [
        migrations.AlterField(
            model_name='appointment',
            name='status',
            field=models.CharField(choices=[('pend', 'Pending'), ('done', 'Done'), ('resc', 'Rescheduled'), ('canc', 'Cancelled')], default='pend', max_length=4),
        ),
    ]