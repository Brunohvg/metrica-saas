// apps/commissions/static/js/rules/modal.js

import { fetchRuleById } from './api.js';
import { renderViewModalContent, renderEditModalContent } from './render.js';
import { renderTiersContent, setCurrentRuleData } from './tiers.js';
import { showErrorAlert } from './utils.js';

let createRuleModal, viewRuleModal, editRuleModal, tiersModal;

export function initializeModals() {
    createRuleModal = new bootstrap.Modal(document.getElementById('createRuleModal'));
    viewRuleModal = new bootstrap.Modal(document.getElementById('viewRuleModal'));
    editRuleModal = new bootstrap.Modal(document.getElementById('editRuleModal'));
    tiersModal = new bootstrap.Modal(document.getElementById('tiersModal'));
}

export async function openViewModal(ruleId) {
    try {
        const rule = await fetchRuleById(ruleId);
        renderViewModalContent(rule);
        viewRuleModal.show();
    } catch (error) {
        showErrorAlert(error.message);
    }
}

export async function openEditModal(ruleId) {
    try {
        const rule = await fetchRuleById(ruleId);
        renderEditModalContent(rule);
        editRuleModal.show();
    } catch (error) {
        showErrorAlert(error.message);
    }
}

export async function openTiersModal(ruleId) {
    try {
        const rule = await fetchRuleById(ruleId);
        setCurrentRuleData(rule);
        renderTiersContent(rule.tiers);
        tiersModal.show();
    } catch (error) {
        showErrorAlert(error.message);
    }
}

export function getModalInstance(modalId) {
    switch(modalId) {
        case 'createRuleModal': return createRuleModal;
        case 'editRuleModal': return editRuleModal;
        case 'tiersModal': return tiersModal;
        default: return null;
    }
}