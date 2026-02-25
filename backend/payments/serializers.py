from rest_framework import serializers
from .models import Payment

class PaymentSerializer(serializers.ModelSerializer):
    customer_name = serializers.ReadOnlyField(source='customer.name')

    class Meta:
        model = Payment
        fields = '__all__'
