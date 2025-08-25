// apps/accounts/static/js/equipe/modal.js

import { showToast } from './utils.js';
import { deleteUserAPI, fetchUserById } from './api.js';

let userFormModal, deleteUserModal;
let selectedUserId = null; // Armazena o ID do usuário para exclusão

/**
 * Inicializa as instâncias dos modais do Bootstrap e configura os listeners.
 */
export function initializeModals() {
    userFormModal = new bootstrap.Modal(document.getElementById("userFormModal"));
    deleteUserModal = new bootstrap.Modal(document.getElementById("deleteUserModal"));
    
    // O botão de confirmar a exclusão agora chama a nossa nova lógica robusta
    document.getElementById("confirmDeleteBtn").addEventListener("click", handleDeleteConfirmation);
}

/**
 * Abre o modal de formulário, criando ou buscando dados para edição.
 * @param {string|null} userId - O ID do usuário para edição, ou null para criação.
 */
export async function openUserModal(userId = null) {
    const form = document.getElementById("userForm");
    form.reset();
    form.querySelectorAll('.is-valid, .is-invalid').forEach(field => {
        field.classList.remove('is-valid', 'is-invalid');
    });

    const modalTitle = document.getElementById("userFormModalLabel");
    const passwordInput = document.getElementById("password");

    if (userId) {
        // MODO EDIÇÃO
        modalTitle.innerHTML = '<i class="ti ti-user-edit me-2"></i>Editar Usuário';
        passwordInput.placeholder = "Deixe em branco para não alterar";
        passwordInput.required = false;

        try {
            const user = await fetchUserById(userId);
            populateForm(user);
        } catch (error) {
            showToast(error.message, "error");
            return;
        }

    } else {
        // MODO CRIAÇÃO
        modalTitle.innerHTML = '<i class="ti ti-user-plus me-2"></i>Novo Usuário';
        passwordInput.placeholder = "Senha forte";
        passwordInput.required = true;
        document.getElementById('userId').value = '';
    }
    userFormModal.show();
}

/**
 * Preenche o formulário com os dados de um usuário existente.
 * @param {object} user - O objeto do usuário.
 */
function populateForm(user) {
    document.getElementById('userId').value = user.id;
    document.getElementById('first_name').value = user.first_name || '';
    document.getElementById('username').value = user.username || '';
    document.getElementById('email').value = user.email || '';
    document.getElementById('type_user').value = user.type_user || 'VE';
    document.getElementById('document').value = user.document || '';
    document.getElementById('phone').value = user.phone || '';
    document.getElementById('date_of_birth').value = user.date_of_birth || '';
    document.getElementById('is_active').checked = user.is_active;
}

/**
 * Abre o modal de confirmação de exclusão.
 * @param {string} userId - O ID do usuário a ser excluído.
 */
export function openDeleteModal(userId) {
    selectedUserId = userId;
    deleteUserModal.show();
}

/**
 * Lida com o clique no botão de confirmação de exclusão de forma robusta.
 */
async function handleDeleteConfirmation() {
    if (!selectedUserId) return;

    // 1. Feedback visual imediato: Encontra o card do usuário e o "apaga" visualmente
    const userCard = document.querySelector(`.user-item[data-user-id="${selectedUserId}"]`);
    if (userCard) {
        userCard.style.transition = 'opacity 0.5s ease';
        userCard.style.opacity = '0.3';
    }

    // 2. Fecha o modal de confirmação ANTES de fazer a chamada da API para evitar "vazamento de cliques"
    deleteUserModal.hide();

    try {
        // 3. Chama a API para deletar o usuário
        await deleteUserAPI(selectedUserId);

        // 4. Se a API responder com sucesso:
        showToast("Usuário excluído com sucesso!");

        // 5. Anima a remoção do card da tela e depois dispara o evento para recarregar os dados
        if (userCard) {
            userCard.style.transition = 'height 0.3s ease, margin 0.3s ease, padding 0.3s ease';
            userCard.style.height = '0';
            userCard.style.paddingTop = '0';
            userCard.style.paddingBottom = '0';
            userCard.style.margin = '0';
            userCard.style.overflow = 'hidden';
            
            setTimeout(() => {
                document.dispatchEvent(new Event('usersUpdated'));
            }, 300); // Espera a animação terminar
        } else {
             document.dispatchEvent(new Event('usersUpdated'));
        }

    } catch (error) {
        // 6. Se a API der erro:
        showToast(`Erro: ${error.message}`, "error");
        // Restaura a aparência normal do card
        if (userCard) {
            userCard.style.opacity = '1';
        }
    } finally {
        selectedUserId = null; // Limpa o ID selecionado para a próxima ação
    }
}


/**
 * Fecha o modal de formulário e dispara o evento para recarregar a lista.
 * Usado como callback pela submissão do formulário em form.js.
 */
export function closeModalAndReload() {
    userFormModal.hide();
    document.dispatchEvent(new Event('usersUpdated'));
}