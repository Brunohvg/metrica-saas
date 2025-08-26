from rest_framework import generics
from .serializers import DailySaleSerializer
from ..models import DailySale

class DailySaleListCreateView(generics.ListCreateAPIView):
    queryset = DailySale.objects.all()
    serializer_class = DailySaleSerializer

class DailySaleRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = DailySale.objects.all()
    serializer_class = DailySaleSerializer
