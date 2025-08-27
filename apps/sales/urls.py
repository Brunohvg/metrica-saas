from django.urls import path
from . import views

app_name = 'sales'

urlpatterns = [
    path('', views.DailySaleListView.as_view(), name='daily-sale-list'),
    
]