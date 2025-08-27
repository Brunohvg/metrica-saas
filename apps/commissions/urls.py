from django.urls import path
from . import views

app_name = 'commissions'

urlpatterns = [
    path('', views.CommissionRuleListView.as_view(), name='commission_rule_list'),
    path('create/', views.CommissionRuleCreateView.as_view(), name='commission_rule_create'),
    path('edit/<int:pk>/', views.CommissionRuleUpdateView.as_view(), name='commission_rule_edit'),
    path('delete/<int:pk>/', views.CommissionRuleDeleteView.as_view(), name='commission_rule_delete'),
    path('reports/', views.CommissionReportListView.as_view(), name='commission_report_list'),


]