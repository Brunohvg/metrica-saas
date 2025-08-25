// apps/commissions/static/js/rules/main.js

import { showConfirmAlert, reloadPage } from './utils.js';
import { deleteRuleAPI } from './api.js';
import { initializeModals, openViewModal, openEditModal, openTiersModal, closeModalsAndReload } from './modal.js';
import { setupForms } from './form.js';
import { setupTiersModal } from './tiers.js';
import { setupFiltersAndSearch } from './filters.js';

/**
 * Função principal de inicialização da página.
 */
function initializePage() {
    // Inicializa todos os modais da página
    initializeModals();

    // Configura os formulários de criação e edição
    setupForms(closeModalsAndReload);

    // Configura a interatividade do modal de faixas
    setupTiersModal();
    
    // Configura os filtros e a barra de busca da lista principal
    setupFiltersAndSearch();

    // Expondo as funções que são chamadas pelos `onclick` no HTML
    window.ruleActions = {
        view: openViewModal,
        edit: openEditModal,
        manageTiers: openTiersModal,
        delete: (ruleId) => {
            showConfirmAlert({
                title: 'Excluir esta regra?',
                text: 'Esta ação não pode ser desfeita.',
                confirmButtonText: 'Sim, excluir!'
            }).then((result) => {
                if (result.isConfirmed) {
                    deleteRuleAPI(ruleId).then(reloadPage);
                }
            });
        }
    };
}

// Ponto de entrada do script
document.addEventListener("DOMContentLoaded", initializePage);