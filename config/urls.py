# config/urls.py
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),

    # --- ROTAS DA API (PREFIXO /api/v1/) ---
    path('api/v1/', include('apps.accounts.api.urls')),
    path('api/v1/commissions/', include('apps.commissions.api.urls')),
    path('api/v1/', include('apps.sales.api.urls')),

    # --- ROTAS DO FRONTEND ---
    path('', include('apps.dashboard.urls')), # Dashboard é a página inicial
    path('contas/', include('apps.accounts.urls')),
    path('comissoes/', include('apps.commissions.urls')),
    path('vendas/', include('apps.sales.urls')),
]

# Adicionado para servir arquivos de mídia (fotos de perfil) em ambiente de desenvolvimento
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)