# Em apps/accounts/api/serializers.py

from rest_framework import serializers
from ..models import Account

class AccountsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = [
            'id', 'username', 'first_name', 'last_name', 'email', 
            'type_user', 'document', 'phone', 'date_of_birth', 
            'is_active', 'password'
        ]
        
        extra_kwargs = {
            'password': {'write_only': True},
            # 'first_name' agora é efetivamente o 'nome completo' e é obrigatório.
            'first_name': {'required': True},
            # 'last_name' se torna opcional e não aparecerá no formulário.
            'last_name': {'required': False, 'allow_blank': True},
        }
    
    # Seus métodos create e update continuam perfeitos.
    def create(self, validated_data):
        password = validated_data.pop('password')
        # Garante que last_name seja uma string vazia se não for enviado
        validated_data.setdefault('last_name', '')
        user = Account(**validated_data)
        user.set_password(password)
        user.save()
        return user
    
    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        super().update(instance, validated_data)
        if password:
            instance.set_password(password)
        instance.save()
        return instance