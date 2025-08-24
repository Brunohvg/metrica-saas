# apps/commissions/api/urls.py

from django.urls import path
from . import views

# O app_name permite usar namespaces nas URLs, como 'commissions:report-list'
app_name = 'api_commissions'

urlpatterns = [
    # --- URLs para Relatórios de Comissão ---
    path('reports/', views.CommissionReportListCreateView.as_view(), name='report-list'),
    path('reports/<int:pk>/', views.CommissionReportRetrieveUpdateDestroyView.as_view(), name='report-detail'),

    # --- URLs para Regras de Comissão ---
    path('rules/', views.CommissionRuleListCreateView.as_view(), name='rule-list'),
    path('rules/<int:pk>/', views.CommissionRuleRetrieveUpdateDestroyView.as_view(), name='rule-detail'),

    # --- URLs para Faixas de Comissão ---
    path('tiers/', views.CommissionTierListCreateView.as_view(), name='tier-list'),
    path('tiers/<int:pk>/', views.CommissionTierRetrieveUpdateDestroyView.as_view(), name='tier-detail'),

        # Adicione estas duas no final da lista `urlpatterns`
    path(
        'rules/<int:pk>/tiers/', 
        views.CommissionTierByRuleListView.as_view(),
        name='tier-list-by-rule'
    ),
    path(
        'rules/<int:pk>/tiers/save/', 
        views.CommissionTierSaveView.as_view(),
        name='tier-save-by-rule'
    ),
]