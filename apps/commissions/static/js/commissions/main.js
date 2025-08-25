// apps/commissions/static/js/rules/main.js

import { showConfirmAlert, reloadPage, showErrorAlert } from './utils.js';
import { deleteRuleAPI } from './api.js';
import { initializeModals, openViewModal, openEditModal, openTiersModal } from './modal.js';
import { setupForms } from './form.js';
import { setupFiltersAndSearch } from './filters.js';

function initializePage() {
    initializeModals();
    setupForms();
    setupFiltersAndSearch();

    // Expondo as funções que são chamadas pelos `onclick` no HTML
    window.ruleActions = {
        view: openViewModal,
        edit: openEditModal,
        manageTiers: openTiersModal,
        delete: (ruleId) => {
            showConfirmAlert({
                title: 'Excluir regra?',
                text: 'Você não poderá recuperar depois.',
            }).then((result) => {
                if (result.isConfirmed) {
                    deleteRuleAPI(ruleId)
                        .then(() => {
                            showSuccessAlert('Regra excluída com sucesso.');
                            reloadPage();
                        })
                        .catch(err => showErrorAlert(err.message));
                }
            });
        }
    };
}

document.addEventListener("DOMContentLoaded", initializePage);