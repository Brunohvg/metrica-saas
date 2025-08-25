// rules_form.js
document.addEventListener("DOMContentLoaded", function () {
    const ruleForm = document.getElementById('ruleForm');
    if (ruleForm) {
        ruleForm.addEventListener('submit', function (e) {
            e.preventDefault();
            submitRuleForm();
        });
    }
});

function toggleRuleTypeFields() {
    const ruleType = document.getElementById('ruleType').value;
    const configs = document.querySelectorAll('.rule-config');
    document.getElementById('ruleConfigSection').classList.toggle('d-none', !ruleType);
    configs.forEach(c => c.classList.add('d-none'));

    if (ruleType === 'FLAT') document.getElementById('flatRateConfig').classList.remove('d-none');
    if (ruleType === 'TIERED') document.getElementById('tieredConfig').classList.remove('d-none');
    if (ruleType === 'BONUS') document.getElementById('bonusConfig').classList.remove('d-none');
}

function submitRuleForm() {
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

    fetch(`/api/v1/commissions/rules/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRFToken': getCSRFToken() },
        body: JSON.stringify(data)
    })
    .then(r => r.ok ? r.json() : r.json().then(err => Promise.reject(err)))
    .then(() => {
        showSuccessAlert('Regra criada com sucesso.');
        bootstrap.Modal.getInstance(document.getElementById('createRuleModal')).hide();
        reloadPage();
    })
    .catch(() => showErrorAlert('Não foi possível criar a regra.'));
}

function saveEditRule() {
    const form = document.getElementById('editRuleForm');
    const formData = new FormData(form);
    const ruleId = formData.get('rule_id');

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

    fetch(`/api/v1/commissions/rules/${ruleId}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'X-CSRFToken': getCSRFToken() },
        body: JSON.stringify(data)
    })
    .then(r => r.ok ? r.json() : r.json().then(err => Promise.reject(err)))
    .then(() => {
        showSuccessAlert('Regra atualizada com sucesso.');
        bootstrap.Modal.getInstance(document.getElementById('editRuleModal')).hide();
        reloadPage();
    })
    .catch(() => showErrorAlert('Não foi possível atualizar a regra.'));
}
