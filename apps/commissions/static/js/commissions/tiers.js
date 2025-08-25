// apps/commissions/static/js/rules/tiers.js

import { renderTierRowHTML } from './render.js';
import { updateRule } from './api.js';
import { showSuccessAlert, showErrorAlert, reloadPage } from './utils.js';

let currentRuleData = null;

export function setCurrentRuleData(ruleData) {
    currentRuleData = ruleData;
}

export function renderTiersContent(tiers = []) {
    const tiersContainer = document.getElementById('tiersContent');
    let tiersHtml = '<div id="tiersContainer">';
    if (tiers && tiers.length > 0) {
        tiers.forEach(t => {
            tiersHtml += renderTierRowHTML(t.min_amount, t.max_amount, t.commission_rate);
        });
    } else {
        tiersHtml += '<div class="text-center p-4 text-muted">Nenhuma faixa configurada.</div>';
    }
    tiersHtml += '</div>';
    tiersContainer.innerHTML = tiersHtml;
}

export function addTier() {
    const container = document.getElementById('tiersContainer');
    const emptyState = container.querySelector('.text-center');
    if (emptyState) emptyState.remove();
    container.insertAdjacentHTML('beforeend', renderTierRowHTML());
}

export function removeTier(button) {
    button.closest('.tier-row').remove();
}

export async function saveTiers() {
    if (!currentRuleData) {
        showErrorAlert('Dados da regra não encontrados.');
        return;
    }

    const tiers = [];
    document.querySelectorAll('#tiersContent .tier-row').forEach(row => {
        const min = row.querySelector('.tier-min').value;
        const max = row.querySelector('.tier-max').value;
        const rate = row.querySelector('.tier-rate').value;
        if (min && rate) {
            tiers.push({
                min_amount: parseFloat(min),
                max_amount: max ? parseFloat(max) : null,
                commission_rate: parseFloat(rate)
            });
        }
    });

    // Sua lógica original enviava o objeto inteiro, vamos mantê-la
    const updatedData = { ...currentRuleData, tiers: tiers };
    delete updatedData.created_at;
    delete updatedData.created_by; // Remove campos que não devem ser enviados de volta

    try {
        await updateRule(currentRuleData.id, updatedData);
        showSuccessAlert('Faixas salvas com sucesso.');
        bootstrap.Modal.getInstance(document.getElementById('tiersModal')).hide();
        reloadPage();
    } catch (error) {
        showErrorAlert(error.message);
    }
}