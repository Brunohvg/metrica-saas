from django import views
from django.views.generic import ListView, TemplateView

class DashboardView(TemplateView):
    template_name = 'dashboard/dashboard.html'

