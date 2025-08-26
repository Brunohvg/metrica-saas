from django.urls import path
from . import views

app_name = 'api_sales'

urlpatterns = [
    path('daily-sales/', views.DailySaleListCreateView.as_view(), name='daily-sale-list-create'),
    path('daily-sales/<int:pk>/', views.DailySaleRetrieveUpdateDestroyView.as_view(), name='daily-sale-detail'),
]