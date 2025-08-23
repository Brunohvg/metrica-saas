from rest_framework import serializers
from ..models import Account

class AccountsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ('id', 'uuid', 'type_user', 'username', 'document', 'phone', 'profile_photo', 'date_of_birth','password',  )
    
    def create(self, validated_data):
        # Retira a senha do dicionário para tratar separado
        password = validated_data.pop('password')
        user = Account(**validated_data)
        user.set_password(password)  # aqui ele salva criptografado
        user.save()
        return user
    
    def update(self, instance, validated_data):
        # Se a senha estiver no dicionário, trata ela separadamente
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance