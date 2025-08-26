from rest_framework import serializers
from ..models import DailySale

class DailySaleSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailySale
        fields = '__all__'

