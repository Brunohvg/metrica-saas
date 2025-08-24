from django.views.generic import ListView, CreateView, UpdateView, DeleteView
from django.urls import reverse_lazy
from .models import CommissionRule

class CommissionRuleListView(ListView):
    model = CommissionRule
    template_name = 'commissions/commission_rule_list.html'
    context_object_name = 'commission_rules'    


class CommissionRuleCreateView(CreateView):
    model = CommissionRule
    template_name = 'commissions/commission_rule_form.html'
    context_object_name = 'commission_rule'
    success_url = reverse_lazy('commissions:commission_rule_list')


class CommissionRuleUpdateView(UpdateView):
    model = CommissionRule
    template_name = 'commissions/commission_rule_form.html'
    context_object_name = 'commission_rule'
    success_url = reverse_lazy('commissions:commission_rule_list')


class CommissionRuleDeleteView(DeleteView):
    model = CommissionRule
    template_name = 'commissions/commission_rule_confirm_delete.html'
    context_object_name = 'commission_rule'
    success_url = reverse_lazy('commissions:commission_rule_list')
