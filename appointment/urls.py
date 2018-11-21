from django.urls import path

from .api import views

urlpatterns = [
  path('api/clients/',
        view=views.ClientListCreateAPIView.as_view(),
        name='client_rest_api'),
  path('api/clients/<uuid:uuid>/',
        view=views.ClientRetrieveUpdateDestroyAPIView.as_view(),
        name='client_rest_api'),
  path('api/appointments/',
        view=views.AppointmentListCreateAPIView.as_view(),
        name='appointments'),
  path('api/appointments/<uuid:uuid>',
        view=views.AppointmentRetrieveUpdateDestroyAPIView.as_view(),
        name='appointments'),
  path('api/services/',
        view=views.ServiceListAPIView.as_view(),
        name='services'),
  path('api/tags/',
        view=views.TagListCreateAPIView.as_view(),
        name='tags'),
  path('api/appointment_service/',
        view=views.AppointmentServiceCreateAPIView.as_view(),
        name='appointment_service'),
]
