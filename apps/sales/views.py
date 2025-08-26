from django.views.generic import ListView, DetailView
from .models import DailySale
from django.urls import reverse_lazy

def is_gestor(user):
    """Verifica se o usuário é um gestor"""
    return user.is_authenticated and user.type_user == 'GE'


class DailySaleListView(ListView):
    model = DailySale
    template_name = 'sales/daily_sale_list.html'
    context_object_name = 'daily_sales'
    paginate_by = 10

    def get_queryset(self):
        """
        Retorna apenas as vendas do vendedor logado.
        Se não houver vendas, retorna um queryset vazio.
        """
        start_date = self.request.GET.get('start_date')
        end_date = self.request.GET.get('end_date')
        user = self.request.user
        if start_date and end_date:
            if is_gestor(user):
                return DailySale.objects.filter(date__range=[start_date, end_date]).order_by('-date')
            return DailySale.objects.filter(seller=user, date__range=[start_date, end_date]).order_by('-date')  
        
        

        if is_gestor(user):
            return DailySale.objects.all().order_by('-date')
        return DailySale.objects.filter(seller=user).order_by('-date')
    
