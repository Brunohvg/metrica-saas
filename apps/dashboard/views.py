# apps/dashboard/views.py
from django.shortcuts import render
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import TemplateView
from django.db.models import Sum, F
from datetime import date
from decimal import Decimal
import json # Importe json aqui

from apps.sales.models import DailySale
from apps.commissions.models import CommissionReport
from apps.accounts.models import Account
from apps.accounts.utils import is_gestor, is_vendedor

class DashboardView(LoginRequiredMixin, TemplateView):
    template_name = 'dashboard/dashboard.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        user = self.request.user
        
        selected_year = int(self.request.GET.get('year', date.today().year))
        selected_month = int(self.request.GET.get('month', date.today().month))

        prev_month = selected_month - 1
        prev_year = selected_year
        if prev_month == 0:
            prev_month = 12
            prev_year -= 1

        sales_qs = DailySale.objects.filter(
            date__year=selected_year,
            date__month=selected_month
        )
        sales_prev_month_qs = DailySale.objects.filter(
            date__year=prev_year,
            date__month=prev_month
        )
        reports_qs = CommissionReport.objects.filter(
            period_year=selected_year,
            period_month=selected_month
        )

        if is_vendedor(user):
            sales_qs = sales_qs.filter(seller=user)
            sales_prev_month_qs = sales_prev_month_qs.filter(seller=user)
            reports_qs = reports_qs.filter(seller=user)
            
        total_sales = sales_qs.aggregate(total=Sum('total_value'))['total'] or Decimal('0.00')
        total_commissions = reports_qs.aggregate(total=Sum('calculated_commission'))['total'] or Decimal('0.00')
        paid_commissions = reports_qs.filter(status='PAID').aggregate(total=Sum('calculated_commission'))['total'] or Decimal('0.00')
        
        prev_total_sales = sales_prev_month_qs.aggregate(total=Sum('total_value'))['total'] or Decimal('0.00')
        sales_growth = 0
        if prev_total_sales > 0:
            sales_growth = ((total_sales - prev_total_sales) / prev_total_sales) * 100
            
        context['total_sales'] = total_sales
        context['total_commissions'] = total_commissions
        context['paid_commissions'] = paid_commissions
        context['pending_commissions'] = total_commissions - paid_commissions
        context['sales_growth'] = round(sales_growth, 2)
        
        context['selected_year'] = selected_year
        context['selected_month'] = selected_month
        context['years'] = range(date.today().year, date.today().year - 5, -1)
        
        # 6. Dados para o gráfico de desempenho
        sales_by_day = sales_qs.annotate(day=F('date')).values('day').annotate(total_day=Sum('total_value')).order_by('day')
        
        # print(f"Sales by day for {selected_month}/{selected_year}: {sales_by_day}") # Debug
        
        chart_labels = sorted(list(set([str(s['day'].day) for s in sales_by_day])))
        
        sales_data_map = {str(s['day'].day): float(s['total_day']) for s in sales_by_day}
        chart_data = [sales_data_map.get(label, 0) for label in chart_labels]
        
        # print(f"Chart Labels: {chart_labels}") # Debug
        # print(f"Chart Data: {chart_data}") # Debug
        
        # Use json.dumps para passar os dados para o JavaScript de forma segura
        context['chart_labels'] = json.dumps(chart_labels)
        context['chart_data'] = json.dumps(chart_data)

        # 7. Dados para o ranking de vendedores (com o cálculo de porcentagem corrigido)
        top_sellers_qs = sales_qs.values(
            'seller__first_name', 
            'seller__last_name', 
            'seller__username'
        ).annotate(
            total_sales_seller=Sum('total_value')
        ).order_by('-total_sales_seller')[:5]

        top_sellers = []
        if top_sellers_qs:
            first_seller_sales = top_sellers_qs[0]['total_sales_seller']
            for seller in top_sellers_qs:
                if first_seller_sales > 0:
                    progress_percentage = (seller['total_sales_seller'] / first_seller_sales) * 100
                else:
                    progress_percentage = 0
                seller['progress_percentage'] = int(progress_percentage)
                top_sellers.append(seller)
        
        context['top_sellers'] = top_sellers

        return context