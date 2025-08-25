// apps/commissions/static/js/rules/tiers.js

import { renderTierRowHTML } from './render.js';
import { updateRule } from './api.js';
import { showSuccessAlert, showErrorAlert } from './utils.js';

let currentRuleData = null; // Armazena a regra que está sendo editada
const tiersContainer = document.getElementById('tiersContent');

/**
 * Guarda os dados da regra atual que está sendo gerenciada.
 * @param {object} ruleData - Os dados completos da regra.
 */
export function setCurrentRuleData(ruleData) {
    currentRuleData = ruleData;
}

/**
 * Renderiza o conteúdo inicial do modal de faixas.
 * @param {Array} tiers - A lista de faixas da regra.
 */
export function renderTiersContent(tiers = []) {
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

/**
 * Adiciona uma nova linha de faixa vazia à interface.
 */
function addTier() {
    const container = document.getElementById('tiersContainer');
    // Remove a mensagem de "nenhuma faixa" se ela existir
    const emptyState = container.querySelector('.text-center');
    if (emptyState) emptyState.remove();
    
    container.insertAdjacentHTML('beforeend', renderTierRowHTML());
}

/**
 * Remove a linha da faixa correspondente ao botão clicado.
 * @param {HTMLElement} button - O botão de remover.
 */
function removeTier(button) {
    button.closest('.tier-row').remove();
    
    // Se não houver mais faixas, mostra a mensagem de estado vazio
    const container = document.getElementById('tiersContainer');
    if (!container.querySelector('.tier-row')) {
         container.innerHTML = '<div class="text-center p-4 text-muted">Nenhuma faixa configurada.</div>';
    }
}

/**
 * Salva as faixas editadas via API.
 */
async function saveTiers() {
    if (!currentRuleData) {
        showErrorAlert('Dados da regra não encontrados.');
        return;
    }

    const tiers = [];
    document.querySelectorAll('#tiersContainer .tier-row').forEach(row => {
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

    // Prepara os dados para a API, enviando apenas os campos que queremos atualizar
    const payload = { tiers };

    try {
        // Usamos PATCH aqui para atualizar apenas as faixas, em vez de PUT que substituiria o objeto inteiro
        await updateRule(currentRuleData.id, payload);
        showSuccessAlert('Faixas salvas com sucesso.');
        // Oculta o modal e recarrega a página
        const tiersModalEl = document.getElementById('tiersModal');
        bootstrap.Modal.getInstance(tiersModalEl).hide();
        setTimeout(() => location.reload(), 300);
    } catch (error) {
        showErrorAlert(error.message);
    }
}


/**
 * Configura os event listeners para o modal de faixas.
 */
export function setupTiersModal() {
    document.getElementById('addTierBtn').addEventListener('click', addTier);
    document.getElementById('saveTiersBtn').addEventListener('click', saveTiers);

    // Usa delegação de eventos para os botões de remover
    tiersContainer.addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-tier-btn')) {
            removeTier(event.target);
        }
    });
}