from django.contrib.auth.views import LoginView
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
        return reverse_lazy('/')  # Redireciona para a página de login após o login bem-sucedido   