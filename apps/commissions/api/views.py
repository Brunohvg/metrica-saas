from rest_framework import generics
from ..models import CommissionReport, CommissionRule, CommissionTier
from .serializers import CommissionReportSerializer, CommissionRuleSerializer, CommissionTierSerializer

class CommissionReportListCreateView(generics.ListCreateAPIView):
    queryset = CommissionReport.objects.all()
    serializer_class = CommissionReportSerializer

class CommissionReportRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = CommissionReport.objects.all()
    serializer_class = CommissionReportSerializer

class CommissionRuleListCreateView(generics.ListCreateAPIView):
    queryset = CommissionRule.objects.all()
    serializer_class = CommissionRuleSerializer

class CommissionRuleRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = CommissionRule.objects.all()
    serializer_class = CommissionRuleSerializer

class CommissionTierListCreateView(generics.ListCreateAPIView):
    queryset = CommissionTier.objects.all()
    serializer_class = CommissionTierSerializer

class CommissionTierRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = CommissionTier.objects.all()
    serializer_class = CommissionTierSerializer



# apps/commissions/api/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
# ... (seus outros imports e views)

# NOVA VIEW para listar as faixas de uma regra específica
class CommissionTierByRuleListView(APIView):
    def get(self, request, pk):
        rule = get_object_or_404(CommissionRule, pk=pk)
        tiers = rule.tiers.all().order_by('limit_value')
        serializer = CommissionTierSerializer(tiers, many=True)
        return Response({
            'rule_name': rule.name,
            'tiers': serializer.data
        })

# NOVA VIEW para salvar um conjunto de faixas para uma regra
class CommissionTierSaveView(APIView):
    def post(self, request, pk):
        rule = get_object_or_404(CommissionRule, pk=pk)
        tiers_data = request.data.get('tiers', [])

        # Deleta as faixas antigas para simplificar a lógica
        rule.tiers.all().delete()

        # Adiciona a FK da regra nos dados de cada faixa a ser criada
        for tier_info in tiers_data:
            tier_info['rule'] = rule.pk
        
        serializer = CommissionTierSerializer(data=tiers_data, many=True)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response({'status': 'success'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)