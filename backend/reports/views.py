from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from django.db.models import Sum, Count
from products.models import Product
from sales.models import Sale
from customers.models import Customer
from datetime import date

class DashboardStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        today = date.today()
        total_products = Product.objects.count()
        today_sales = Sale.objects.filter(date__date=today).aggregate(Sum('total_price'))['total_price__sum'] or 0
        total_pending = Customer.objects.aggregate(Sum('total_due'))['total_due__sum'] or 0
        low_stock_count = Product.objects.filter(stock_quantity__lt=5).count()

        return Response({
            "total_products": total_products,
            "today_sales": today_sales,
            "total_pending": total_pending,
            "low_stock_count": low_stock_count
        })

class SalesReportView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # Simplistic report for MVP
        sales = Sale.objects.all().order_by('-date')
        data = [{
            "date": s.date,
            "product": s.product.name,
            "quantity": s.quantity,
            "total_price": s.total_price,
            "payment_type": s.payment_type,
            "customer": s.customer.name if s.customer else "Walk-in"
        } for s in sales]
        return Response(data)

class StockReportView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        products = Product.objects.all()
        data = [{
            "name": p.name,
            "category": p.category,
            "stock": p.stock_quantity,
            "price": p.price
        } for p in products]
        return Response(data)

class CustomerPendingReportView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        customers = Customer.objects.filter(total_due__gt=0)
        data = [{
            "name": c.name,
            "mobile": c.mobile,
            "total_due": c.total_due
        } for c in customers]
        return Response(data)
