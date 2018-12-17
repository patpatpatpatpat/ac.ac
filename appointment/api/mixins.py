class RepresentationMixin(object):
    """
    This mixin will handle representation of nested serializers. When used,
    `to_representation` method will require `nested_serializers` property
    in the serializer's Meta property. Below is an example:

        nested_serializers = [
            {
                'field': 'field_name',
                'serializer_class': ObjectSerializer,
                'many': True
            },
            {
                'another_field': 'field_name',
                'serializer_class': AnotherObjectSerializer,
                    'many': False  # False is default
            },
            ...
        ]
    """

    def to_representation(self, instance):
        data = super(RepresentationMixin, self).to_representation(instance)
        meta = getattr(self, 'Meta', None)
        nested_serializers = getattr(meta, 'nested_serializers', {})
        if nested_serializers:

            for obj in nested_serializers:
                field = obj.get('field')
                serializer_class = obj.get('serializer_class')
                many = obj.get('many', False)
                if getattr(instance, field, None):
                    serializer = serializer_class(
                        getattr(instance, field),
                        many=many,
                        context=self.context
                    )
                    data.update({
                        field: serializer.data
                    })

        return data
