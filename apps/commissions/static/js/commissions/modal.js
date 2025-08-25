// apps/commissions/static/js/rules/modal.js

import { fetchRuleById } from './api.js';
import { renderViewModalContent, renderEditModalContent } from './render.js';
import { renderTiersContent, setCurrentRuleData } from './tiers.js';
import { showErrorAlert } from './utils.js';

let createRuleModal, viewRuleModal, editRuleModal, tiersModal;

/**
 * Inicializa todas as instâncias de modais do Bootstrap.
 */
export function initializeModals() {
    createRuleModal = new bootstrap.Modal(document.getElementById('createRuleModal'));
    viewRuleModal = new bootstrap.Modal(document.getElementById('viewRuleModal'));
    editRuleModal = new bootstrap.Modal(document.getElementById('editRuleModal'));
    tiersModal = new bootstrap.Modal(document.getElementById('tiersModal'));
}

/**
 * Abre o modal de visualização.
 * @param {number} ruleId - O ID da regra.
 */
export async function openViewModal(ruleId) {
    try {
        const rule = await fetchRuleById(ruleId);
        renderViewModalContent(rule);
        viewRuleModal.show();
    } catch (error) {
        showErrorAlert(error.message);
    }
}

/**
 * Abre o modal de edição.
 * @param {number} ruleId - O ID da regra.
 */
export async function openEditModal(ruleId) {
    try {
        const rule = await fetchRuleById(ruleId);
        renderEditModalContent(rule);
        editRuleModal.show();
    } catch (error) {
        showErrorAlert(error.message);
    }
}

/**
 * Abre o modal de gerenciamento de faixas.
 * @param {number} ruleId - O ID da regra.
 */
export async function openTiersModal(ruleId) {
    try {
        const rule = await fetchRuleById(ruleId);
        setCurrentRuleData(rule); // Guarda os dados da regra atual para salvar depois
        renderTiersContent(rule.tiers);
        tiersModal.show();
    } catch (error) {
        showErrorAlert(error.message);
    }
}

/**
 * Fecha todos os modais relevantes e recarrega a página.
 * Usado como callback após sucesso.
 */
export function closeModalsAndReload() {
    createRuleModal.hide();
    editRuleModal.hide();
    tiersModal.hide();
    // Um pequeno delay para dar tempo do modal fechar antes do reload
    setTimeout(() => location.reload(), 300);
}