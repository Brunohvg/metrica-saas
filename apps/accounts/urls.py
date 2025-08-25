from django.urls import path
from . import views

app_name = 'accounts'

urlpatterns = [

    path('', views.CustomLoginView.as_view(), name='login' ),
    path('logout/', views.CustomLogoutView.as_view(), name='logout'),
    path('cadastrar-vendedor/', views.cadastrar_vendedor, name='cadastrar_vendedor'),
]