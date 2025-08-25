# apps/commissions/serializers.py
from rest_framework import serializers
from ..models import CommissionReport, CommissionRule, CommissionTier

class CommissionTierSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommissionTier
        fields = ['id', 'min_amount', 'max_amount', 'commission_rate']

class CommissionRuleSerializer(serializers.ModelSerializer):
    tiers = CommissionTierSerializer(many=True, required=False)

    class Meta:
        model = CommissionRule
        fields = [
            'id', 'name', 'rule_type', 'description', 'created_by',
            'flat_percentage', 'bonus_type', 'bonus_amount', 'tiers'
        ]
        read_only_fields = ['created_by']

    def validate(self, data):
        rule_type = data.get('rule_type')
        flat_percentage = data.get('flat_percentage')
        bonus_type = data.get('bonus_type')
        bonus_amount = data.get('bonus_amount')

        if rule_type == 'FLAT':
            if flat_percentage is None:
                raise serializers.ValidationError({"flat_percentage": "Este campo é obrigatório para o tipo de regra 'Valor Fixo'."})
            if bonus_type is not None or bonus_amount is not None:
                raise serializers.ValidationError({"bonus": "Campos de bônus não são permitidos para o tipo de regra 'Valor Fixo'."})
        
        elif rule_type == 'TIERED':
            if flat_percentage is not None or bonus_type is not None or bonus_amount is not None:
                raise serializers.ValidationError({"fields": "Campos de valor fixo ou bônus não são permitidos para o tipo de regra 'Por Faixa'."})
                
        elif rule_type == 'BONUS':
            if bonus_type is None or bonus_amount is None:
                raise serializers.ValidationError({"bonus": "Campos de bônus são obrigatórios para o tipo de regra 'Bônus'."})
            if flat_percentage is not None:
                raise serializers.ValidationError({"flat_percentage": "Campo de valor fixo não é permitido para o tipo de regra 'Bônus'."})
        
        return data
        
    def create(self, validated_data):
        tiers_data = validated_data.pop('tiers', [])
        rule = CommissionRule.objects.create(**validated_data)
        for tier_data in tiers_data:
            CommissionTier.objects.create(rule=rule, **tier_data)
        return rule

    def update(self, instance, validated_data):
        tiers_data = validated_data.pop('tiers', None)
        
        instance.name = validated_data.get('name', instance.name)
        instance.rule_type = validated_data.get('rule_type', instance.rule_type)
        instance.description = validated_data.get('description', instance.description)

        # Lidar com a atualização de campos específicos com base no tipo de regra
        if instance.rule_type == 'FLAT':
            instance.flat_percentage = validated_data.get('flat_percentage', instance.flat_percentage)
            instance.bonus_type = None
            instance.bonus_amount = None
        elif instance.rule_type == 'TIERED':
            instance.flat_percentage = None
            instance.bonus_type = None
            instance.bonus_amount = None
        elif instance.rule_type == 'BONUS':
            instance.bonus_type = validated_data.get('bonus_type', instance.bonus_type)
            instance.bonus_amount = validated_data.get('bonus_amount', instance.bonus_amount)
            instance.flat_percentage = None

        instance.save()
        
        if tiers_data is not None:
            instance.tiers.all().delete()
            for tier_data in tiers_data:
                CommissionTier.objects.create(rule=instance, **tier_data)

        return instance

class CommissionReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommissionReport
        fields = '__all__'