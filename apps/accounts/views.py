from django.contrib.auth.views import LoginView, LogoutView
from .forms import LoginForm
from django.urls import reverse_lazy
from django.contrib import messages


class CustomLoginView(LoginView):
    template_name = 'accounts/login.html'
    redirect_authenticated_user = True
    form_class = LoginForm

    def form_invalid(self, form):
        # Adiciona mensagens customizadas
        messages.error(self.request, 'Usuário ou senha inválidos.', extra_tags='danger')
        return super().form_invalid(form)
    
    def get_success_url(self):
        return reverse_lazy('dashboard:dashboard')  # Redireciona para a página de dashboard após o login bem-sucedido


class CustomLogoutView(LogoutView):
    next_page = reverse_lazy('accounts:login') # Redireciona para a página de login após o logout

    def dispatch(self, request, *args, **kwargs):
        messages.success(request, 'Você saiu com sucesso.')
        return super().dispatch(request, *args, **kwargs)
    

# views.py - Adicione esta view ao seu arquivo de views existente

from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.contrib.auth.decorators import user_passes_test

def is_gestor(user):
    """Verifica se o usuário é um gestor"""
    return user.is_authenticated and user.type_user == 'GE'

@login_required
@user_passes_test(is_gestor, login_url='/')
def cadastrar_vendedor(request):
    """
    View para cadastro de vendedores - apenas gestores podem acessar
    """
    return render(request, 'accounts/equipe.html')
