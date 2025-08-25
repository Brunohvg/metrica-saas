// apps/commissions/static/js/rules/form.js

import { createRule, updateRule } from './api.js';
import { showSuccessAlert, showErrorAlert, reloadPage } from './utils.js';

/**
 * Configura os listeners para os formulários de criação e edição.
 * @param {function} callback - Função a ser chamada após o sucesso.
 */
export function setupForms(callback) {
    const createForm = document.getElementById('ruleForm');
    const editForm = document.getElementById('editRuleForm');
    const ruleTypeSelect = document.getElementById('ruleType');

    if (createForm) {
        createForm.addEventListener('submit', (e) => {
            e.preventDefault();
            submitCreateForm(callback);
        });
    }

    if (editForm) {
        const saveEditBtn = document.getElementById('saveEditBtn');
        saveEditBtn.addEventListener('click', () => {
             submitEditForm(callback);
        });
    }

    if (ruleTypeSelect) {
        ruleTypeSelect.addEventListener('change', toggleRuleTypeFields);
    }
}

/**
 * Mostra/esconde os campos específicos para cada tipo de regra no formulário de criação.
 */
function toggleRuleTypeFields() {
    const ruleType = document.getElementById('ruleType').value;
    const configSection = document.getElementById('ruleConfigSection');
    const configs = configSection.querySelectorAll('.rule-config');

    configSection.classList.toggle('d-none', !ruleType);
    configs.forEach(c => c.classList.add('d-none'));

    if (ruleType === 'FLAT') document.getElementById('flatRateConfig').classList.remove('d-none');
    if (ruleType === 'TIERED') document.getElementById('tieredConfig').classList.remove('d-none');
    if (ruleType === 'BONUS') document.getElementById('bonusConfig').classList.remove('d-none');
}

/**
 * Envia os dados do formulário de CRIAÇÃO.
 * @param {function} callback - Função a ser chamada após o sucesso.
 */
async function submitCreateForm(callback) {
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
        callback(); // Fecha o modal e recarrega
    } catch (error) {
        showErrorAlert(error.message);
    }
}

/**
 * Envia os dados do formulário de EDIÇÃO.
 * @param {function} callback - Função a ser chamada após o sucesso.
 */
async function submitEditForm(callback) {
    const form = document.getElementById('editRuleForm');
    const formData = new FormData(form);
    const ruleId = formData.get('id');

    // O rule_type está desabilitado, então precisamos pegá-lo de outra forma ou garantir que ele seja enviado
    const ruleTypeValue = document.querySelector('#editRuleForm select[name="rule_type"]').value;

    const data = {
        name: formData.get('name'),
        description: formData.get('description'),
        rule_type: ruleTypeValue
    };

    if (data.rule_type === 'FLAT') data.flat_percentage = parseFloat(formData.get('flat_percentage')) || null;
    if (data.rule_type === 'BONUS') {
        data.bonus_type = formData.get('bonus_type');
        data.bonus_amount = parseFloat(formData.get('bonus_amount')) || null;
    }

    try {
        await updateRule(ruleId, data);
        showSuccessAlert('Regra atualizada com sucesso.');
        callback(); // Fecha o modal e recarrega
    } catch (error) {
        showErrorAlert(error.message);
    }
}