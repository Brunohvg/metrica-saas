from rest_framework import generics
from ..models import Account
from .serializers import AccountsSerializer

class UserListCreateAPIView(generics.ListCreateAPIView):
    """
    A simple ViewSet for viewing and editing users.
    """
    queryset = Account.objects.all()
    serializer_class = AccountsSerializer

class UserRetrieveUpdateDestroyAPIView(generics.RetrieveUpdateDestroyAPIView):
    """
    A simple ViewSet for viewing, editing, and deleting a user.
    """
    queryset = Account.objects.all()
    serializer_class = AccountsSerializer