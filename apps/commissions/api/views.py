from rest_framework import generics
from ..models import CommissionReport, CommissionRule, CommissionTier
from .serializers import CommissionReportSerializer, CommissionRuleSerializer

# Views para CommissionReport - sem mudanças
class CommissionReportListCreateView(generics.ListCreateAPIView):
    queryset = CommissionReport.objects.all()
    serializer_class = CommissionReportSerializer

class CommissionReportRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = CommissionReport.objects.all()
    serializer_class = CommissionReportSerializer

# Views para CommissionRule - sem mudanças, mas agora elas são mais poderosas
class CommissionRuleListCreateView(generics.ListCreateAPIView):
    queryset = CommissionRule.objects.all()
    serializer_class = CommissionRuleSerializer

class CommissionRuleRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = CommissionRule.objects.all()
    serializer_class = CommissionRuleSerializer

# As views CommissionTierListCreateView e CommissionTierRetrieveUpdateDestroyView são redundantes
# pois a lógica de gerenciamento das faixas será tratada diretamente pelo CommissionRuleSerializer.
# Portanto, elas devem ser removidas.
# class CommissionTierListCreateView...
# class CommissionTierRetrieveUpdateDestroyView...

# As views abaixo são desnecessárias e devem ser removidas, pois a lógica já está no serializer.
# class CommissionTierByRuleListView(APIView)...
# class CommissionTierSaveView(APIView)...