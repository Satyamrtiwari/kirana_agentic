from rest_framework import viewsets, permissions
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction
from .models import Product, StockIn
from .serializers import ProductSerializer, StockInSerializer

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]

class StockInViewSet(viewsets.ModelViewSet):
    queryset = StockIn.objects.all().order_by('-date')
    serializer_class = StockInSerializer
    permission_classes = [permissions.IsAuthenticated]

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        product = serializer.validated_data['product']
        quantity = serializer.validated_data['quantity_received']

        # Increase stock
        product.stock_quantity += quantity
        product.save()

        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
