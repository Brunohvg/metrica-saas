# apps/accounts/models.py
from django.db import models
from django.contrib.auth.models import AbstractUser
from apps.core.models import BaseModel

class Accounts(AbstractUser, BaseModel):
    """
    Modelo de usuário customizado que estende o usuário padrão do Django.

    Herda todos os campos do AbstractUser (username, email, etc.) e do nosso
    BaseModel (id, is_active, timestamps).
    """
    class TypeUser(models.TextChoices):
        GESTOR = 'GE', 'Gestor'
        VENDEDOR = 'VE', 'Vendedor'
        CAIXA = 'CX', 'Caixa'
        CONTABIL = 'CT', 'Contábil'

    type_user = models.CharField(max_length=2, choices=TypeUser.choices, default=TypeUser.VENDEDOR, verbose_name="Tipo de Usuário", help_text="Define o papel e as permissões do usuário no sistema.")
    document = models.CharField(max_length=14, unique=True, verbose_name="Documento", help_text="CPF ou CNPJ do usuário, apenas números.")
    phone = models.CharField(max_length=15, blank=True, null=True, verbose_name="Telefone", help_text="Número de telefone com DDD.")
    date_of_birth = models.DateField(blank=True, null=True, verbose_name="Data de Nascimento")
    profile_photo = models.ImageField(upload_to='profile_photos/', blank=True, null=True, verbose_name="Foto de Perfil")

    def __str__(self):
        return self.get_full_name() or self.username

    class Meta:
        verbose_name = "Conta"
        verbose_name_plural = "Contas"