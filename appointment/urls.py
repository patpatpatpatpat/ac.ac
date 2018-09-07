from django.urls import path

from .api import views


urlpatterns = [
  path('api/clients/', view=views.ClientListCreateAPIView.as_view(), name='client_rest_api'),
  path('api/clients/<uuid:uuid>/', view=views.ClientRetrieveUpdateDestroyAPIView.as_view(), name='client_rest_api'),
]
