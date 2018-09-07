from rest_framework import serializers

from ..models import Client


class ClientSerializer(serializers.ModelSerializer):
    referrer = serializers.HyperlinkedRelatedField(read_only=True, view_name='client_rest_api', lookup_field='uuid')

    class Meta:
        model = Client
        fields = [
            'uuid',
            'first_name',
            'last_name',
            'contact_number',
            'fb_name',
            'fb_profile',
            'referrer',
        ]
