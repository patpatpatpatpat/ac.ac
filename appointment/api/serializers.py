from rest_framework import serializers
from taggit.models import Tag

from ..models import Appointment, AppointmentService, Client, Service


class ClientSerializer(serializers.ModelSerializer):
    referrer = serializers.HyperlinkedRelatedField(read_only=True, view_name='client_rest_api', lookup_field='uuid')

    class Meta:
        model = Client
        fields = [
            'id',
            'uuid',
            'first_name',
            'last_name',
            'contact_number',
            'fb_name',
            'fb_profile',
            'referrer',
        ]


class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = [
            'id',
            'uuid',
            'name',
        ]


class AppointmentServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppointmentService
        fields = [
            'id',
            'uuid',
        ]


class AppointmentSerializer(serializers.ModelSerializer):
    services = AppointmentServiceSerializer(read_only=True, many=True)

    class Meta:
        model = Appointment
        fields = [
            'id',
            'uuid',
            'client',
            'datetime',
            'notes',
            'services',
        ]

    def create(self, validated_data):
        instance = super(AppointmentSerializer, self).create(validated_data)
        request = self.context['request']

        # TODO: handle tags that are created on the fly
        tags = Tag.objects.filter(id__in=request.data.get('tags', []))
        instance.tags.add(*tags)

        for service in Service.objects.filter(uuid__in=request.data['services']):
            AppointmentService.objects.create(
                appointment=instance,
                service=service,
            )

        return instance


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'
