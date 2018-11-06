import uuid as uuid_lib

from django.db import models


class Client(models.Model):
    uuid = models.UUIDField(
        db_index=True,
        default=uuid_lib.uuid4,
        editable=False,
    )
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)

    contact_number = models.TextField()
    fb_name = models.CharField(max_length=30, blank=True)
    fb_profile = models.CharField(max_length=100, blank=True)

    referrer = models.ForeignKey('self', blank=True, null=True, on_delete=models.CASCADE)

    # client source ? e.g: Facebook, friend, etc, flyer, etc

    date_created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.get_full_name()

    def get_full_name(self):
        return '{fname} {lname}'.format(fname=self.first_name, lname=self.last_name)


class Appointment(models.Model):
    PENDING = 'pend'
    DONE = 'done'
    RESCHEDULED = 'resc'
    CANCELLED = 'canc'
    STATUS_CHOICES = (
        (PENDING, 'Pending'),
        (DONE, 'Done'),
        (RESCHEDULED, 'Rescheduled'),
        (CANCELLED, 'Cancelled'),
    )
    uuid = models.UUIDField(
        db_index=True,
        default=uuid_lib.uuid4,
        editable=False,
    )
    date_created = models.DateTimeField(auto_now_add=True)

    client = models.ForeignKey('Client', on_delete=models.CASCADE)
    datetime = models.DateTimeField()
    status = models.CharField(max_length=4, choices=STATUS_CHOICES)

    discount = models.IntegerField(blank=True, null=True)
    notes = models.TextField(blank=True)
    services = models.ManyToManyField(
        'Service',
        through='AppointmentService',
        through_fields=('appointment', 'service'),
    )

    def __str__(self):
        return self.client.fb_name + ' - ' + str(self.datetime)


class AppointmentService(models.Model):
    uuid = models.UUIDField(
        db_index=True,
        default=uuid_lib.uuid4,
        editable=False,
    )
    appointment = models.ForeignKey('Appointment', on_delete=models.CASCADE)
    service = models.ForeignKey('Service', on_delete=models.CASCADE)

    is_retouch = models.BooleanField(default=False)
    is_free = models.BooleanField(default=False)

    original_price = models.IntegerField(default=0)
    discount = models.IntegerField(default=0)
    final_price = models.IntegerField(default=0)

    def __str__(self):
        return '{service} - {price}'.format(service=self.service.name, price=self.service.price)


class Service(models.Model):
    uuid = models.UUIDField(
        db_index=True,
        default=uuid_lib.uuid4,
        editable=False,
    )
    name = models.CharField(max_length=100)
    price = models.IntegerField()

    active = models.BooleanField(default=True)
    has_free_retouch = models.BooleanField(default=False)

    date_created = models.DateTimeField(auto_now_add=True)

    # promo tags? e.g: kadayawan2018

    def __str__(self):
        return self.name
