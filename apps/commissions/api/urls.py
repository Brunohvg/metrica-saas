# apps/commissions/api/urls.py

from django.urls import path
from . import views

# O app_name permite usar namespaces nas URLs, como 'commissions:report-list'
app_name = 'api_commissions'

urlpatterns = [
    # --- URLs para Relatórios de Comissão ---
    # GET: Lista todos os relatórios | POST: Cria um novo relatório
    path('reports/', views.CommissionReportListCreateView.as_view(), name='report-list'),
    # GET: Obtém detalhes | PUT: Atualiza | DELETE: Exclui um relatório específico
    path('reports/<int:pk>/', views.CommissionReportRetrieveUpdateDestroyView.as_view(), name='report-detail'),

    # --- URLs para Regras de Comissão ---
    # GET: Lista todas as regras | POST: Cria uma nova regra
    path('rules/', views.CommissionRuleListCreateView.as_view(), name='rule-list'),
    # GET: Obtém detalhes da regra e suas faixas aninhadas
    # PUT: Atualiza a regra e suas faixas aninhadas
    # DELETE: Exclui a regra e todas as suas faixas
    path('rules/<int:pk>/', views.CommissionRuleRetrieveUpdateDestroyView.as_view(), name='rule-detail'),
]