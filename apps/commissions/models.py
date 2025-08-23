# apps/commissions/models.py
from django.db import models
from django.conf import settings
from apps.core.models import BaseModel

class CommissionRule(BaseModel):
    """
    Define uma regra de comissão que pode ser aplicada a vendedores.
    Ex: "Comissão Padrão 5%", "Bônus de Fim de Ano".
    """
    class RuleType(models.TextChoices):
        FLAT = 'FLAT', 'Valor Fixo'
        TIERED = 'TIERED', 'Por Faixa'
        BONUS = 'BONUS', 'Bônus'

    name = models.CharField(max_length=100, unique=True, verbose_name="Nome da Regra")
    rule_type = models.CharField(max_length=10, choices=RuleType.choices, verbose_name="Tipo de Regra", help_text="Define como a comissão será calculada (fixa, por faixas, etc.).")
    description = models.TextField(blank=True, null=True, verbose_name="Descrição")
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Criado Por", help_text="Usuário que criou a regra.")

    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name = "Regra de Comissão"
        verbose_name_plural = "Regras de Comissão"

class CommissionTier(BaseModel):
    """
    Define uma faixa (tier) para uma regra de comissão do tipo 'Por Faixa'.
    Ex: Para vendas até R$ 1000,00, a comissão é de 5%.
    """
    rule = models.ForeignKey(CommissionRule, on_delete=models.CASCADE, related_name='tiers', verbose_name="Regra", help_text="A qual regra de comissão esta faixa pertence.")
    limit_value = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Valor Limite da Faixa", help_text="O valor máximo de vendas para aplicar este percentual.")
    percentage = models.DecimalField(max_digits=5, decimal_places=2, verbose_name="Percentual (%)", help_text="A comissão a ser paga nesta faixa.")

    def __str__(self):
        return f"Regra '{self.rule.name}': Até R$ {self.limit_value} -> {self.percentage}%"
    
    class Meta:
        verbose_name = "Faixa de Comissão"
        verbose_name_plural = "Faixas de Comissão"
        ordering = ['rule', 'limit_value']

class CommissionReport(BaseModel):
    """
    Armazena o resultado do cálculo de comissão de um vendedor para um período.
    Este é o registro financeiro que será aprovado e pago.
    """
    class ReportStatus(models.TextChoices):
        PENDING = 'PENDING', 'Pendente'
        APPROVED = 'APPROVED', 'Aprovado'
        PAID = 'PAID', 'Pago'
    
    seller = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.PROTECT, related_name='commission_reports', verbose_name="Vendedor")
    period_year = models.PositiveIntegerField(verbose_name="Ano do Período")
    period_month = models.PositiveIntegerField(verbose_name="Mês do Período")
    total_sales = models.DecimalField(max_digits=12, decimal_places=2, verbose_name="Vendas Totais no Período")
    commission_rule_applied = models.ForeignKey(CommissionRule, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="Regra Aplicada")
    calculated_commission = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Comissão Calculada")
    status = models.CharField(max_length=10, choices=ReportStatus.choices, default=ReportStatus.PENDING, verbose_name="Status")
    locked_at = models.DateTimeField(blank=True, null=True, verbose_name="Fechado em", help_text="Data em que o relatório foi fechado e não pode mais ser alterado.")

    def __str__(self):
        return f"Relatório de {self.seller.username} - {self.period_month:02d}/{self.period_year}"

    class Meta:
        verbose_name = "Relatório de Comissão"
        verbose_name_plural = "Relatórios de Comissão"
        unique_together = ['seller', 'period_year', 'period_month']