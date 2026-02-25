from django.db import models
from customers.models import Customer

class Payment(models.Model):
    PAYMENT_MODE_CHOICES = [
        ('Cash', 'Cash'),
        ('UPI', 'UPI'),
    ]

    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2)
    payment_mode = models.CharField(max_length=20, choices=PAYMENT_MODE_CHOICES)
    date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, default='Paid') # In MVP, every payment entry is a 'receipt'

    def __str__(self):
        return f"Payment: {self.customer.name} - {self.amount_paid}"
