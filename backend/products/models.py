from django.db import models

class Product(models.Model):
    name = models.CharField(max_length=255)
    category = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2) # Price per unit
    stock_quantity = models.IntegerField(default=0)

    def __str__(self):
        return self.name

class StockIn(models.Model):
    supplier_name = models.CharField(max_length=255)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity_received = models.IntegerField()
    cost_price = models.DecimalField(max_digits=10, decimal_places=2)
    date = models.DateField(auto_now_add=True)

    def __str__(self):
        return f"Stock In: {self.product.name} from {self.supplier_name}"
