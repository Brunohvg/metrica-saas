// rules_view.js

function viewRule(ruleId) {
    fetch(`/api/v1/commissions/rules/${ruleId}/`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'X-CSRFToken': getCSRFToken() }
    })
    .then(r => r.ok ? r.json() : Promise.reject())
    .then(data => {
        const ruleTypeDisplay = { FLAT: 'Valor Fixo', TIERED: 'Por Faixa', BONUS: 'Bônus' };

        let specificContent = '';
        if (data.rule_type === 'FLAT' && data.flat_percentage) {
            specificContent = `<div class="col-12"><strong>Percentual Fixo:</strong><br><span class="text-muted">${data.flat_percentage}%</span></div>`;
        } else if (data.rule_type === 'BONUS' && data.bonus_amount) {
            specificContent = `
                <div class="col-md-6"><strong>Tipo de Bônus:</strong><br><span class="text-muted">${data.bonus_type === 'FIXED' ? 'Valor Fixo' : 'Percentual'}</span></div>
                <div class="col-md-6"><strong>Valor do Bônus:</strong><br><span class="text-muted">${data.bonus_amount}</span></div>
            `;
        }

        document.getElementById('viewRuleContent').innerHTML = `
            <div class="modal-section">
                <h6 class="modal-section-title"><i class="ti ti-info-circle"></i> Informações da Regra</h6>
                <div class="row g-3">
                    <div class="col-md-6"><strong>Nome:</strong><br><span class="text-muted">${data.name}</span></div>
                    <div class="col-md-6"><strong>Tipo:</strong><br>
                        <span class="rule-type-badge rule-type-${data.rule_type}">
                            ${ruleTypeDisplay[data.rule_type] || data.rule_type}
                        </span>
                    </div>
                    <div class="col-12"><strong>Descrição:</strong><br><span class="text-muted">${data.description || 'Sem descrição'}</span></div>
                    ${specificContent}
                    <div class="col-md-6"><strong>Criado por:</strong><br><span class="text-muted">${data.created_by || 'Sistema'}</span></div>
                    <div class="col-md-6"><strong>Data de criação:</strong><br><span class="text-muted">${new Date(data.created_at).toLocaleString('pt-BR')}</span></div>
                </div>
            </div>
        `;
        new bootstrap.Modal(document.getElementById('viewRuleModal')).show();
    })
    .catch(() => showErrorAlert('Não foi possível carregar os detalhes da regra.'));
}

function editRule(ruleId) {
    fetch(`/api/v1/commissions/rules/${ruleId}/`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'X-CSRFToken': getCSRFToken() }
    })
    .then(r => r.ok ? r.json() : Promise.reject())
    .then(data => {
        let specificFields = '';
        if (data.rule_type === 'FLAT') {
            specificFields = `
                <div class="col-md-6">
                    <label class="form-label fw-medium form-label-required">Percentual de Comissão (%)</label>
                    <div class="input-group">
                        <span class="input-group-text" style="background:#7FB6F0;color:white;">%</span>
                        <input type="number" class="form-control" name="flat_percentage" value="${data.flat_percentage || ''}" step="0.01">
                    </div>
                </div>`;
        } else if (data.rule_type === 'BONUS') {
            specificFields = `
                <div class="col-md-6">
                    <label class="form-label fw-medium">Tipo de Bônus</label>
                    <select class="form-select" name="bonus_type">
                        <option value="PERCENTAGE" ${data.bonus_type === 'PERCENTAGE' ? 'selected' : ''}>Percentual</option>
                        <option value="FIXED" ${data.bonus_type === 'FIXED' ? 'selected' : ''}>Valor Fixo</option>
                    </select>
                </div>
                <div class="col-md-6">
                    <label class="form-label fw-medium">Valor do Bônus</label>
                    <input type="number" class="form-control" name="bonus_amount" value="${data.bonus_amount || ''}" step="0.01">
                </div>`;
        }

        document.getElementById('editRuleContent').innerHTML = `
            <input type="hidden" name="rule_id" value="${ruleId}">
            <div class="modal-section">
                <h6 class="modal-section-title"><i class="ti ti-edit"></i>Editar Informações</h6>
                <div class="row g-3">
                    <div class="col-md-8">
                        <label class="form-label fw-medium form-label-required">Nome da Regra</label>
                        <input type="text" class="form-control" name="name" value="${data.name}" required>
                    </div>
                    <div class="col-md-4">
                        <label class="form-label fw-medium form-label-required">Tipo de Regra</label>
                        <select class="form-select" name="rule_type" disabled>
                            <option value="FLAT" ${data.rule_type === 'FLAT' ? 'selected' : ''}>Valor Fixo</option>
                            <option value="TIERED" ${data.rule_type === 'TIERED' ? 'selected' : ''}>Por Faixa</option>
                            <option value="BONUS" ${data.rule_type === 'BONUS' ? 'selected' : ''}>Bônus</option>
                        </select>
                    </div>
                    <div class="col-12">
                        <label class="form-label fw-medium">Descrição</label>
                        <textarea class="form-control" name="description">${data.description || ''}</textarea>
                    </div>
                    ${specificFields}
                </div>
            </div>
        `;
        new bootstrap.Modal(document.getElementById('editRuleModal')).show();
    })
    .catch(() => showErrorAlert('Não foi possível carregar os dados da regra.'));
}

function deleteRule(ruleId) {
    showConfirmAlert({
        title: 'Excluir regra?',
        text: 'Você não poderá recuperar depois.',
        confirmButtonText: 'Sim, excluir!',
        confirmButtonColor: '#DC2626'
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(`/api/v1/commissions/rules/${ruleId}/`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json', 'X-CSRFToken': getCSRFToken() }
            })
            .then(r => r.ok ? true : Promise.reject())
            .then(() => {
                showSuccessAlert('Regra excluída com sucesso.');
                reloadPage();
            })
            .catch(() => showErrorAlert('Não foi possível excluir a regra.'));
        }
    });
}
