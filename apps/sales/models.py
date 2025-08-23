# apps/sales/models.py
from django.db import models
from django.conf import settings
from apps.core.models import BaseModel

class DailySale(BaseModel):
    """
    Registra uma venda individual realizada por um vendedor.
    """
    class SaleType(models.TextChoices):
        PRODUCT = 'PRODUCT', 'Produto'
        SERVICE = 'SERVICE', 'Serviço'
        IN_STORE = 'IN_STORE', 'Na Loja'

    seller = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name='daily_sales', verbose_name="Vendedor", help_text="Usuário que realizou a venda.")
    item_sold = models.CharField(max_length=255, verbose_name="Item Vendido", help_text="Nome ou descrição do produto/serviço vendido.")
    date = models.DateField(verbose_name="Data da Venda", help_text="Data em que a venda foi efetuada.")
    total_value = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Valor Total", help_text="O valor total da transação.")
    sale_type = models.CharField(max_length=10, choices=SaleType.choices, verbose_name="Tipo de Venda")
    description = models.TextField(blank=True, null=True, verbose_name="Descrição", help_text="Observações adicionais sobre a venda.")

    def __str__(self):
        return f"Venda de '{self.item_sold}' por {self.seller.username} em {self.date}"

    class Meta:
        verbose_name = "Venda Diária"
        verbose_name_plural = "Vendas Diárias"