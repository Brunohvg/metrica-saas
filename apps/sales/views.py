# apps/sales/views.py
from django.shortcuts import render
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import ListView
from apps.sales.models import DailySale
from apps.accounts.utils import is_gestor
from apps.accounts.models import Account
from datetime import datetime


class DailySaleListView(LoginRequiredMixin, ListView):
    model = DailySale
    template_name = 'sales/daily_sales.html'
    context_object_name = 'daily_sales'
    paginate_by = 15

    def get_queryset(self):
        seller_id = self.request.GET.get('seller')
        start_date_str = self.request.GET.get('start_date')
        end_date_str = self.request.GET.get('end_date')
        user = self.request.user

        qs = DailySale.objects.all()

        # Restringe a queryset para vendedores
        if user and not is_gestor(user):
            qs = qs.filter(seller=user)
        # Filtro por vendedor (apenas gestores podem usar)
        elif seller_id:
            qs = qs.filter(seller__id=seller_id)

        # Filtro por intervalo de datas
        if start_date_str:
            try:
                date_start = datetime.strptime(start_date_str, '%Y-%m-%d').date()
                qs = qs.filter(date__gte=date_start)
            except (ValueError, TypeError):
                pass
        
        if end_date_str:
            try:
                date_end = datetime.strptime(end_date_str, '%Y-%m-%d').date()
                qs = qs.filter(date__lte=date_end)
            except (ValueError, TypeError):
                pass

        return qs.order_by('-date')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['sellers'] = Account.objects.filter(type_user='VE', is_active=True).order_by('first_name')
        
        # Passa os valores de filtro para manter a seleção no template
        context['selected_seller'] = self.request.GET.get('seller')
        context['selected_start_date'] = self.request.GET.get('start_date')
        context['selected_end_date'] = self.request.GET.get('end_date')

        return context