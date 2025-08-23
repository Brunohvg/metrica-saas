from django.urls import path
from . import views
urlpatterns = [
    # Define your API endpoints here
    path('users/', views.UserListCreateAPIView.as_view(), name='user-list'),
    path('users/<int:pk>/', views.UserRetrieveUpdateDestroyAPIView.as_view(), name='user-detail'),
]