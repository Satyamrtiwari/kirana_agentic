from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from .models import Payment
from .serializers import PaymentSerializer
from customers.models import Customer
from django.db import transaction

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all().order_by('-date')
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    @transaction.atomic
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        customer = serializer.validated_data['customer']
        amount_paid = serializer.validated_data['amount_paid']

        # Update customer's total due
        if customer.total_due < amount_paid:
            return Response({"error": "Payment amount exceeds total due"}, status=status.HTTP_400_BAD_REQUEST)
        
        customer.total_due -= amount_paid
        customer.save()

        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
