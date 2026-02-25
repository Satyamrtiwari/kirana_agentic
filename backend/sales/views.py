from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from .models import Sale
from .serializers import SaleSerializer
from products.models import Product
from customers.models import Customer
from django.db import transaction

class SaleViewSet(viewsets.ModelViewSet):
    queryset = Sale.objects.all().order_by('-date')
    serializer_class = SaleSerializer
    permission_classes = [permissions.IsAuthenticated]

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        product = serializer.validated_data['product']
        quantity = serializer.validated_data['quantity']
        payment_type = serializer.validated_data['payment_type']
        customer = serializer.validated_data.get('customer')

        # Prevent negative stock
        if product.stock_quantity < quantity:
            return Response({"error": "Insufficient stock"}, status=status.HTTP_400_BAD_REQUEST)

        # Reduce stock
        product.stock_quantity -= quantity
        product.save()

        # Handle Credit (Udhaar)
        if payment_type == 'Credit' and customer:
            customer.total_due += serializer.validated_data['total_price']
            customer.save()
        elif payment_type == 'Credit' and not customer:
            return Response({"error": "Customer required for credit sale"}, status=status.HTTP_400_BAD_REQUEST)

        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
