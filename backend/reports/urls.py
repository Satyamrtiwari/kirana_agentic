from django.urls import path
from .views import DashboardStatsView, SalesReportView, StockReportView, CustomerPendingReportView

urlpatterns = [
    path('dashboard/', DashboardStatsView.as_view(), name='dashboard-stats'),
    path('sales/', SalesReportView.as_view(), name='sales-report'),
    path('stock/', StockReportView.as_view(), name='stock-report'),
    path('pending-payments/', CustomerPendingReportView.as_view(), name='pending-payments-report'),
]
