// rules_tiers.js

function manageTiers(ruleId) {
    fetch(`/api/v1/commissions/rules/${ruleId}/`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'X-CSRFToken': getCSRFToken() }
    })
        .then(r => r.ok ? r.json() : Promise.reject())
        .then(data => {
            currentRuleData = data;
            let tiersHtml = '<div id="tiersContainer">';
            if (data.tiers && data.tiers.length > 0) {
                data.tiers.forEach(t => {
                    tiersHtml += renderTierRow(t.min_amount, t.max_amount, t.commission_rate);
                });
            } else {
                tiersHtml += '<div class="text-center p-4 text-muted">Nenhuma faixa configurada.</div>';
            }
            tiersHtml += '</div>';
            document.getElementById('tiersContent').innerHTML = tiersHtml;
            new bootstrap.Modal(document.getElementById('tiersModal')).show();
        })
        .catch(() => showErrorAlert('Não foi possível carregar as faixas.'));
}

function renderTierRow(min = "", max = "", rate = "") {
    return `
    <div class="tier-row row g-3 mb-2">
        <div class="col-md-3"><input type="number" class="form-control tier-min" value="${min}" placeholder="Mínimo"></div>
        <div class="col-md-3"><input type="number" class="form-control tier-max" value="${max}" placeholder="Máximo"></div>
        <div class="col-md-3"><input type="number" class="form-control tier-rate" value="${rate}" placeholder="%"></div>
        <div class="col-md-3"><button class="btn btn-danger btn-sm w-100" onclick="removeTier(this)">Remover</button></div>
    </div>`;
}

function addTier() {
    const container = document.getElementById('tiersContainer');
    container.insertAdjacentHTML('beforeend', renderTierRow());
}

function removeTier(button) {
    button.closest('.tier-row').remove();
}

function saveTiers() {
    if (!currentRuleData) {
        showErrorAlert('Dados da regra não encontrados.');
        return;
    }

    const tiers = [];
    document.querySelectorAll('.tier-row').forEach(row => {
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

    const updatedData = { ...currentRuleData, tiers: tiers };
    delete updatedData.created_at;
    delete updatedData.created_by;

    fetch(`/api/v1/commissions/rules/${currentRuleData.id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'X-CSRFToken': getCSRFToken() },
        body: JSON.stringify(updatedData)
    })
        .then(r => r.ok ? r.json() : Promise.reject())
        .then(() => {
            showSuccessAlert('Faixas salvas com sucesso.');
            bootstrap.Modal.getInstance(document.getElementById('tiersModal')).hide();
            reloadPage();
        })
        .catch(() => showErrorAlert('Não foi possível salvar as faixas.'));
}
