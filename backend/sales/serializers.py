from rest_framework import serializers
from .models import Sale
from products.models import Product

class SaleSerializer(serializers.ModelSerializer):
    product_name = serializers.ReadOnlyField(source='product.name')
    customer_name = serializers.ReadOnlyField(source='customer.name')

    class Meta:
        model = Sale
        fields = '__all__'
