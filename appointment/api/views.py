from rest_framework.generics import (
    ListCreateAPIView,
    RetrieveUpdateDestroyAPIView,
)

from rest_framework.permissions import IsAuthenticated

from ..models import Client
from .serializers import ClientSerializer


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
