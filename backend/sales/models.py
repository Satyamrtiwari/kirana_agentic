from django.db import models
from products.models import Product
from customers.models import Customer

class Sale(models.Model):
    PAYMENT_CHOICES = [
        ('Cash', 'Cash'),
        ('UPI', 'UPI'),
        ('Credit', 'Credit (Udhaar)'),
    ]

    customer = models.ForeignKey(Customer, on_delete=models.SET_NULL, null=True, blank=True) # Null for walk-in
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    payment_type = models.CharField(max_length=20, choices=PAYMENT_CHOICES)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Sale: {self.product.name} - {self.quantity}"
