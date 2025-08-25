// apps/commissions/static/js/rules/render.js

const RULE_TYPE_DISPLAY = { FLAT: 'Valor Fixo', TIERED: 'Por Faixa', BONUS: 'Bônus' };

/**
 * Renderiza o conteúdo do modal de visualização de uma regra.
 * @param {object} rule - Os dados da regra.
 */
export function renderViewModalContent(rule) {
    let specificContent = '';
    if (rule.rule_type === 'FLAT' && rule.flat_percentage) {
        specificContent = `<div class="col-12"><strong>Percentual Fixo:</strong><br><span class="text-muted">${rule.flat_percentage}%</span></div>`;
    } else if (rule.rule_type === 'BONUS' && rule.bonus_amount) {
        specificContent = `
            <div class="col-md-6"><strong>Tipo de Bônus:</strong><br><span class="text-muted">${rule.bonus_type === 'FIXED' ? 'Valor Fixo' : 'Percentual'}</span></div>
            <div class="col-md-6"><strong>Valor do Bônus:</strong><br><span class="text-muted">${rule.bonus_amount}</span></div>
        `;
    }

    const content = `
        <div class="modal-section">
            <h6 class="modal-section-title"><i class="ti ti-info-circle"></i> Informações da Regra</h6>
            <div class="row g-3">
                <div class="col-md-6"><strong>Nome:</strong><br><span class="text-muted">${rule.name}</span></div>
                <div class="col-md-6"><strong>Tipo:</strong><br>
                    <span class="rule-type-badge rule-type-${rule.rule_type}">
                        ${RULE_TYPE_DISPLAY[rule.rule_type] || rule.rule_type}
                    </span>
                </div>
                <div class="col-12"><strong>Descrição:</strong><br><span class="text-muted">${rule.description || 'Sem descrição'}</span></div>
                ${specificContent}
                <div class="col-md-6"><strong>Criado por:</strong><br><span class="text-muted">${rule.created_by?.username || 'Sistema'}</span></div>
                <div class="col-md-6"><strong>Data de criação:</strong><br><span class="text-muted">${new Date(rule.created_at).toLocaleString('pt-BR')}</span></div>
            </div>
        </div>
    `;
    document.getElementById('viewRuleContent').innerHTML = content;
}

/**
 * Renderiza o conteúdo do formulário de edição de uma regra.
 * @param {object} rule - Os dados da regra.
 */
export function renderEditModalContent(rule) {
    let specificFields = '';
    if (rule.rule_type === 'FLAT') {
        specificFields = `
            <div class="col-md-6">
                <label class="form-label fw-medium form-label-required">Percentual de Comissão (%)</label>
                <div class="input-group">
                    <span class="input-group-text" style="background:#7FB6F0;color:white;">%</span>
                    <input type="number" class="form-control" name="flat_percentage" value="${rule.flat_percentage || ''}" step="0.01">
                </div>
            </div>`;
    } else if (rule.rule_type === 'BONUS') {
        specificFields = `
            <div class="col-md-6">
                <label class="form-label fw-medium">Tipo de Bônus</label>
                <select class="form-select" name="bonus_type">
                    <option value="PERCENTAGE" ${rule.bonus_type === 'PERCENTAGE' ? 'selected' : ''}>Percentual</option>
                    <option value="FIXED" ${rule.bonus_type === 'FIXED' ? 'selected' : ''}>Valor Fixo</option>
                </select>
            </div>
            <div class="col-md-6">
                <label class="form-label fw-medium">Valor do Bônus</label>
                <input type="number" class="form-control" name="bonus_amount" value="${rule.bonus_amount || ''}" step="0.01">
            </div>`;
    }

    const content = `
        <input type="hidden" name="id" value="${rule.id}">
        <div class="modal-section">
            <h6 class="modal-section-title"><i class="ti ti-edit"></i>Editar Informações</h6>
            <div class="row g-3">
                <div class="col-md-8">
                    <label class="form-label fw-medium form-label-required">Nome da Regra</label>
                    <input type="text" class="form-control" name="name" value="${rule.name}" required>
                </div>
                <div class="col-md-4">
                    <label class="form-label fw-medium form-label-required">Tipo de Regra</label>
                    <select class="form-select" name="rule_type" disabled>
                        <option value="FLAT" ${rule.rule_type === 'FLAT' ? 'selected' : ''}>Valor Fixo</option>
                        <option value="TIERED" ${rule.rule_type === 'TIERED' ? 'selected' : ''}>Por Faixa</option>
                        <option value="BONUS" ${rule.rule_type === 'BONUS' ? 'selected' : ''}>Bônus</option>
                    </select>
                </div>
                <div class="col-12">
                    <label class="form-label fw-medium">Descrição</label>
                    <textarea class="form-control" name="description">${rule.description || ''}</textarea>
                </div>
                ${specificFields}
            </div>
        </div>
    `;
    document.getElementById('editRuleContent').innerHTML = content;
}

/**
 * Renderiza uma única linha de faixa no modal de faixas.
 * @param {number} min - Valor mínimo da faixa.
 * @param {number} max - Valor máximo da faixa.
 * @param {number} rate - Percentual da faixa.
 * @returns {string} - O HTML da linha.
 */
export function renderTierRowHTML(min = "", max = "", rate = "") {
    return `
    <div class="tier-row row g-3 mb-2">
        <div class="col-md-3"><input type="number" class="form-control tier-min" value="${min}" placeholder="Mínimo"></div>
        <div class="col-md-3"><input type="number" class="form-control tier-max" value="${max}" placeholder="Máximo"></div>
        <div class="col-md-3"><input type="number" class="form-control tier-rate" value="${rate}" placeholder="%"></div>
        <div class="col-md-3"><button class="btn btn-danger btn-sm w-100 remove-tier-btn">Remover</button></div>
    </div>`;
}