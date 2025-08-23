# apps/core/models.py
import uuid
from django.db import models

class BaseModel(models.Model):
    """
    Um modelo base abstrato que fornece campos padrão para todos os outros modelos.

    Este modelo não cria uma tabela no banco de dados. Em vez disso, quando outros
    modelos herdam dele, os campos definidos aqui são adicionados a esses modelos.

    Atributos:
        id (UUIDField): A chave primária única para cada registro, usando UUID4.
        is_active (BooleanField): Usado para "soft delete". Em vez de apagar um
                                  registro, nós o desativamos.
        created_at (DateTimeField): Armazena a data e hora em que o registro foi criado.
        updated_at (DateTimeField): Armazena a data e hora da última atualização do registro.
    """
    uuid = models.UUIDField(default=uuid.uuid4, editable=False, verbose_name="UUID")
    is_active = models.BooleanField(default=True, verbose_name="Ativo", help_text="Desmarque para desativar o registro em vez de excluí-lo.")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Data de Criação")
    updated_at = models.DateTimeField(auto_now=True, verbose_name="Data de Atualização")

    class Meta:
        abstract = True
        ordering = ['-created_at']