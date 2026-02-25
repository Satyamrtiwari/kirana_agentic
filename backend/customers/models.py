from django.db import models

class Customer(models.Model):
    name = models.CharField(max_length=255)
    mobile = models.CharField(max_length=15)
    address = models.TextField(blank=True, null=True)
    credit_limit = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    total_due = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)

    def __str__(self):
        return self.name
