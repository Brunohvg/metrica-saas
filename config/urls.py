from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('apps.accounts.api.urls')),
    path('accounts/', include('apps.accounts.urls')),
    #path('commissions/', include('apps.commissions.urls')),
    #path('sales/', include('apps.sales.urls')),
    
    
]
