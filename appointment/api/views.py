from rest_framework.generics import (CreateAPIView, ListAPIView,
                                     ListCreateAPIView,
                                     RetrieveUpdateDestroyAPIView)
from rest_framework.permissions import IsAuthenticated
from taggit.models import Tag

from ..models import Appointment, Client, Service
from .serializers import (AppointmentSerializer, AppointmentServiceSerializer,
                          ClientSerializer, ServiceSerializer, TagSerializer)


class ClientListCreateAPIView(ListCreateAPIView):
    queryset = Client.objects.all()
    permission_classes = (IsAuthenticated, )
    serializer_class = ClientSerializer
    lookup_field = 'uuid'


class ClientRetrieveUpdateDestroyAPIView(RetrieveUpdateDestroyAPIView):
    queryset = Client.objects.all()
    permission_classes = (IsAuthenticated, )
    serializer_class = ClientSerializer
    lookup_field = 'uuid'


class AppointmentListCreateAPIView(ListCreateAPIView):
    queryset = Appointment.objects.all()
    permission_classes = (IsAuthenticated, )
    serializer_class = AppointmentSerializer
    lookup_field = 'uuid'


class AppointmentRetrieveUpdateDestroyAPIView(RetrieveUpdateDestroyAPIView):
    queryset = Appointment.objects.all()
    permission_classes = (IsAuthenticated, )
    serializer_class = AppointmentSerializer
    lookup_field = 'uuid'


class ServiceListAPIView(ListAPIView):
    queryset = Service.objects.all()
    permission_classes = (IsAuthenticated, )
    serializer_class = ServiceSerializer


class TagListCreateAPIView(ListCreateAPIView):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer


class AppointmentServiceCreateAPIView(CreateAPIView):
    serializer_class = AppointmentServiceSerializer
