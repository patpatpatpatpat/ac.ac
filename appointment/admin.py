from django.contrib import admin

from . import models as app_models


class AppointmentServiceAdmin(admin.ModelAdmin):
    model = app_models.AppointmentService
    list_display = [
      '__str__',
      'service',
      'is_retouch',
    ]


class ClientAdmin(admin.ModelAdmin):
    model = app_models.Client
    list_display = [
        'last_name',
        'first_name',
        'fb_name',
        'referrer',
        'date_created',
    ]


class AppointmentServiceInline(admin.TabularInline):
    model = app_models.Appointment.services.through


class AppointmentAdmin(admin.ModelAdmin):
    model = app_models.Appointment
    list_display = [
        'client',
        'datetime',
        'status',
    ]
    inlines = [
        AppointmentServiceInline,
    ]
    list_filter = [
      'status',
      'datetime',
    ]


class ServiceAdmin(admin.ModelAdmin):
    model = app_models.Service
    list_display = [
        'name',
        'date_created',
    ]

admin.site.register(app_models.Client, ClientAdmin)
admin.site.register(app_models.Appointment, AppointmentAdmin)
admin.site.register(app_models.AppointmentService, AppointmentServiceAdmin)
admin.site.register(app_models.Service, ServiceAdmin)
