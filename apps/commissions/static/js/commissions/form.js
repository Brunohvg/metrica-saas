// apps/commissions/static/js/rules/form.js

import { createRule, updateRule } from './api.js';
import { showSuccessAlert, showErrorAlert, reloadPage } from './utils.js';
import { getModalInstance } from './modal.js';

export function setupForms() {
    const createForm = document.getElementById('ruleForm');
    const editFormButton = document.querySelector('#editRuleModal .modal-footer button[onclick]'); // Botão Salvar do modal de edição
    const ruleTypeSelect = document.getElementById('ruleType');

    if (createForm) {
        createForm.addEventListener('submit', (e) => {
            e.preventDefault();
            submitCreateForm();
        });
    }

    if (editFormButton) {
        // Remove o onclick antigo para evitar duplicação e adiciona um listener
        const newBtn = editFormButton.cloneNode(true);
        editFormButton.parentNode.replaceChild(newBtn, editFormButton);
        newBtn.addEventListener('click', submitEditForm);
    }
    
    if (ruleTypeSelect) {
        ruleTypeSelect.addEventListener('change', toggleRuleTypeFields);
    }
}

export function toggleRuleTypeFields() {
    const ruleType = document.getElementById('ruleType').value;
    const configSection = document.getElementById('ruleConfigSection');
    const configs = configSection.querySelectorAll('.rule-config');

    configSection.classList.toggle('d-none', !ruleType);
    configs.forEach(c => c.classList.add('d-none'));

    if (ruleType === 'FLAT') document.getElementById('flatRateConfig').classList.remove('d-none');
    if (ruleType === 'TIERED') document.getElementById('tieredConfig').classList.remove('d-none');
    if (ruleType === 'BONUS') document.getElementById('bonusConfig').classList.remove('d-none');
}

async function submitCreateForm() {
    const form = document.getElementById('ruleForm');
    const formData = new FormData(form);
    const data = {
        name: formData.get('name'),
        rule_type: formData.get('rule_type'),
        description: formData.get('description'),
    };

    if (data.rule_type === 'FLAT') data.flat_percentage = parseFloat(formData.get('flat_percentage')) || null;
    if (data.rule_type === 'BONUS') {
        data.bonus_type = formData.get('bonus_type');
        data.bonus_amount = parseFloat(formData.get('bonus_amount')) || null;
    }
    
    try {
        await createRule(data);
        showSuccessAlert('Regra criada com sucesso.');
        getModalInstance('createRuleModal').hide();
        reloadPage();
    } catch(error) {
        showErrorAlert(error.message);
    }
}

async function submitEditForm() {
    const form = document.getElementById('editRuleForm');
    const formData = new FormData(form);
    const ruleId = formData.get('id'); // Alterado de 'rule_id' para 'id' para consistência
    
    const data = {
        name: formData.get('name'),
        description: formData.get('description'),
        rule_type: document.querySelector('#editRuleForm select[name="rule_type"]').value
    };

    if (data.rule_type === 'FLAT') data.flat_percentage = parseFloat(formData.get('flat_percentage')) || null;
    if (data.rule_type === 'BONUS') {
        data.bonus_type = formData.get('bonus_type');
        data.bonus_amount = parseFloat(formData.get('bonus_amount')) || null;
    }
    
    try {
        await updateRule(ruleId, data);
        showSuccessAlert('Regra atualizada com sucesso.');
        getModalInstance('editRuleModal').hide();
        reloadPage();
    } catch(error) {
        showErrorAlert(error.message);
    }
}