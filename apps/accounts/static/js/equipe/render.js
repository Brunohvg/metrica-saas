// apps/accounts/static/js/equipe/render.js

import { getInitials, getDisplayName, getTypeIcon } from './utils.js';

const TYPE_LABELS = { 'GE': 'Gestor', 'VE': 'Vendedor', 'CX': 'Caixa', 'CT': 'Contábil' };

/**
 * Renderiza a lista de usuários na tela, agrupada por tipo.
 * @param {Array} users - A lista de usuários vinda da API.
 */
export function renderUsersCompact(users) {
    const listContainer = document.getElementById("usersCompactList");

    const groupedUsers = users.reduce((acc, user) => {
        if (!acc[user.type_user]) acc[user.type_user] = [];
        acc[user.type_user].push(user);
        return acc;
    }, {});

    let html = '';
    const typeOrder = ['GE', 'VE', 'CX', 'CT'];

    typeOrder.forEach(type => {
        if (groupedUsers[type]) {
            html += generateGroupHeaderHTML(type, groupedUsers[type].length);
            groupedUsers[type].forEach(user => {
                html += generateUserCardHTML(user);
            });
        }
    });

    listContainer.innerHTML = html;
}

/**
 * Gera o HTML para o cabeçalho de um grupo de usuários.
 * @param {string} type - A sigla do tipo.
 * @param {number} count - A quantidade de usuários no grupo.
 * @returns {string} - O HTML do cabeçalho.
 */
function generateGroupHeaderHTML(type, count) {
    return `
        <div class="group-header-compact group-section" data-group-type="${type}">
            <div class="d-flex align-items-center justify-content-between">
                <div class="d-flex align-items-center">
                    <i class="ti ti-${getTypeIcon(type)} me-2"></i>
                    <strong>${TYPE_LABELS[type]}</strong>
                    <span class="ms-2 text-muted">(${count})</span>
                </div>
            </div>
        </div>
    `;
}

/**
 * Gera o HTML para o card de um único usuário.
 * @param {object} user - O objeto do usuário.
 * @returns {string} - O HTML do card.
 */
function generateUserCardHTML(user) {
    const statusClass = user.is_active ? 'status-active' : 'status-inactive';
    const statusText = user.is_active ? 'Ativo' : 'Inativo';

    return `
        <div class="user-card-compact user-item" 
             data-user-id="${user.id}"  // <-- MUDANÇA IMPORTANTE AQUI
             data-user-type="${user.type_user}"
             data-user-name="${getDisplayName(user).toLowerCase()}"
             data-user-email="${user.email ? user.email.toLowerCase() : ''}"
             data-user-username="${user.username.toLowerCase()}">
            <div class="d-flex align-items-center">
                <div class="user-avatar-small me-3" style="background-color: #7FB6F0;">
                    ${getInitials(user)}
                </div>
                <div class="flex-grow-1">
                    <div class="d-flex align-items-center justify-content-between">
                        <div>
                            <h6 class="mb-0 fw-semibold" style="font-size: 0.9rem;">${getDisplayName(user)}</h6>
                            <div class="d-flex align-items-center mt-1">
                                <small class="text-muted me-3">@${user.username}</small>
                                <span class="user-type-badge-small user-type-${user.type_user}">${TYPE_LABELS[user.type_user]}</span>
                            </div>
                        </div>
                        <div class="d-flex align-items-center gap-3">
                            <div class="d-none d-md-block">
                                <small class="text-muted d-block">${user.email || 'Sem email'}</small>
                                <small class="text-muted">${user.phone || 'Sem telefone'}</small>
                            </div>
                            <div class="d-flex align-items-center">
                                <span class="status-dot ${statusClass} me-2"></span>
                                <small class="text-muted">${statusText}</small>
                            </div>
                            <div class="d-flex gap-1">
                                <button class="action-btn btn btn-outline-primary btn-sm" onclick="window.modalActions.openUserModal('${user.id}')" title="Editar">
                                    <i class="ti ti-edit" style="font-size: 0.875rem;"></i>
                                </button>
                                <button class="action-btn btn btn-outline-danger btn-sm" onclick="window.modalActions.openDeleteModal('${user.id}')" title="Excluir">
                                    <i class="ti ti-trash" style="font-size: 0.875rem;"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

/**
 * Atualiza a contagem de usuários nos botões de filtro.
 * @param {Array} users - A lista de todos os usuários.
 */
export function updateCounts(users) {
    const counts = users.reduce((acc, user) => {
        acc[user.type_user] = (acc[user.type_user] || 0) + 1;
        return acc;
    }, {});

    document.getElementById('countAll').textContent = users.length;
    document.getElementById('countGE').textContent = counts.GE || 0;
    document.getElementById('countVE').textContent = counts.VE || 0;
    document.getElementById('countCX').textContent = counts.CX || 0;
    document.getElementById('countCT').textContent = counts.CT || 0;
}