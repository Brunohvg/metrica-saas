# apps/commissions/utils.py

from decimal import Decimal
from django.db.models import Sum
from apps.sales.models import DailySale
from apps.commissions.models import CommissionRule, CommissionTier

def calculate_commission(seller, rule_id, period_year, period_month):
    """
    Calcula a comissão de um vendedor com base em uma regra e período.
    
    Args:
        seller (Account): O objeto do vendedor.
        rule_id (int): O ID da regra de comissão a ser aplicada.
        period_year (int): O ano do período de cálculo.
        period_month (int): O mês do período de cálculo.
    
    Returns:
        Decimal: O valor total da comissão calculada.
    """
    
    # 1. Obter a regra e as vendas do período
    try:
        rule = CommissionRule.objects.get(id=rule_id)
    except CommissionRule.DoesNotExist:
        return Decimal('0.00') # Retorna 0 se a regra não for encontrada

    total_sales_for_period = DailySale.objects.filter(
        seller=seller,
        date__year=period_year,
        date__month=period_month
    ).aggregate(Sum('total_value'))['total_value__sum'] or Decimal('0.00')

    calculated_commission = Decimal('0.00')

    # 2. Aplicar a lógica de cálculo baseada no tipo da regra
    if rule.rule_type == CommissionRule.RuleType.FLAT:
        if rule.flat_percentage is not None:
            calculated_commission = total_sales_for_period * (rule.flat_percentage / Decimal('100.00'))

    elif rule.rule_type == CommissionRule.RuleType.TIERED:
        # A lógica TIERED é mais complexa, pois depende das faixas.
        tiers = rule.tiers.all().order_by('min_amount')
        for tier in tiers:
            min_amount = tier.min_amount
            max_amount = tier.max_amount

            if max_amount is None:
                # Última faixa (sem limite superior)
                if total_sales_for_period >= min_amount:
                    calculated_commission += (total_sales_for_period - min_amount) * (tier.commission_rate / Decimal('100.00'))
            else:
                # Faixas intermediárias com limite
                if total_sales_for_period >= min_amount:
                    # Calcula a comissão para o valor que está dentro da faixa
                    value_in_tier = min(total_sales_for_period, max_amount) - min_amount
                    calculated_commission += value_in_tier * (tier.commission_rate / Decimal('100.00'))

    elif rule.rule_type == CommissionRule.RuleType.BONUS:
        if rule.bonus_type == CommissionRule.BonusType.PERCENTAGE:
            if rule.bonus_amount is not None:
                calculated_commission = total_sales_for_period * (rule.bonus_amount / Decimal('100.00'))
        elif rule.bonus_type == CommissionRule.BonusType.FIXED:
            if rule.bonus_amount is not None:
                calculated_commission = rule.bonus_amount

    return calculated_commission