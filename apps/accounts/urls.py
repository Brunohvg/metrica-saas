from django.urls import path
from . import views

app_name = 'accounts'

urlpatterns = [
    # Define your API endpoints here
    path('', views.CustomLoginView.as_view(), name='login' ),
    path('logout/', views.CustomLogoutView.as_view(), name='logout'),
]