from rest_framework import serializers
from ..models import CommissionReport, CommissionRule, CommissionTier

class CommissionReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommissionReport
        fields = '__all__'

class CommissionRuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommissionRule
        fields = '__all__'

class CommissionTierSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommissionTier
        fields = '__all__'

    