# apps/sales/signals.py
from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import DailySale
from apps.commissions.models import CommissionReport, CommissionRule
from apps.commissions.utils import calculate_commission
from decimal import Decimal
from django.db.models import Sum    

@receiver(post_save, sender=DailySale)
def update_commission_report(sender, instance, created, **kwargs):
    """
    Atualiza o relatório de comissão do vendedor após cada nova venda.
    """
    if created:
        seller = instance.seller
        sale_date = instance.date
        period_year = sale_date.year
        period_month = sale_date.month

        # 1. Encontrar a regra de comissão aplicável (ex: a regra padrão)
        try:
            commission_rule = CommissionRule.objects.get(name="taxa")
        except CommissionRule.DoesNotExist:
            return  # Não faz nada se a regra não for encontrada

        # 2. Obter ou criar o CommissionReport para o período
        report, created = CommissionReport.objects.get_or_create(
            seller=seller,
            period_year=period_year,
            period_month=period_month,
            defaults={
                'total_sales': Decimal('0.00'),
                'calculated_commission': Decimal('0.00'),
                'commission_rule_applied': commission_rule
            }
        )

        # 3. Recalcular o valor total de vendas
        # Para garantir precisão, some todas as vendas do período
        all_sales_for_period = DailySale.objects.filter(
            seller=seller,
            date__year=period_year,
            date__month=period_month
        ).aggregate(total_value=Sum('total_value'))['total_value'] or Decimal('0.00')

        # 4. Calcular a comissão com base no novo total
        new_calculated_commission = calculate_commission(
            seller=seller,
            rule_id=commission_rule.id,
            period_year=period_year,
            period_month=period_month
        )

        # 5. Atualizar o relatório com os novos valores
        report.total_sales = all_sales_for_period
        report.calculated_commission = new_calculated_commission
        report.save()