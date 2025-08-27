# apps/commissions/views.py
from django.views.generic import ListView, CreateView, UpdateView, DeleteView
from django.urls import reverse_lazy
from .models import CommissionRule, CommissionReport
from django.db.models import Sum
from datetime import datetime

# Regras de comissão
class CommissionRuleListView(ListView):
    model = CommissionRule
    template_name = 'commissions/commission_rule_list.html'
    context_object_name = 'commission_rules'

class CommissionRuleCreateView(CreateView):
    model = CommissionRule
    template_name = 'commissions/commission_rule_form.html'
    success_url = reverse_lazy('commissions:commission_rule_list')

class CommissionRuleUpdateView(UpdateView):
    model = CommissionRule
    template_name = 'commissions/commission_rule_form.html'
    success_url = reverse_lazy('commissions:commission_rule_list')

class CommissionRuleDeleteView(DeleteView):
    model = CommissionRule
    template_name = 'commissions/commission_rule_confirm_delete.html'
    success_url = reverse_lazy('commissions:commission_rule_list')


# Relatórios de comissão
class CommissionReportListView(ListView):
    model = CommissionReport
    template_name = 'commissions/commission_report_list.html'
    context_object_name = 'reports'
    paginate_by = 10

    def get_queryset(self):
        qs = CommissionReport.objects.select_related('seller', 'commission_rule_applied').order_by('-period_year', '-period_month')
        year = self.request.GET.get('period_year')
        month = self.request.GET.get('period_month')
        status = self.request.GET.get('status')

        if year:
            qs = qs.filter(period_year=year)
        if month:
            qs = qs.filter(period_month=month)
        if status:
            qs = qs.filter(status=status)

        return qs

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        current_year = datetime.now().year
        context['years'] = range(current_year, current_year-5, -1)
        context['selected_year'] = int(self.request.GET.get('period_year') or current_year)
        context['months'] = [(i, datetime(2000, i, 1).strftime('%B')) for i in range(1, 13)]
        context['selected_month'] = int(self.request.GET.get('period_month') or datetime.now().month)

        reports = context['reports']
        context['total_sales'] = reports.aggregate(total=Sum('total_sales'))['total'] or 0
        context['total_commissions'] = reports.aggregate(total=Sum('calculated_commission'))['total'] or 0
        return context


