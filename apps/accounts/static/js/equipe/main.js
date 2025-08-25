// apps/accounts/static/js/equipe/main.js

// --- 1. IMPORTAÇÕES ---
// Importamos todas as "ferramentas" de que precisamos dos nossos arquivos modulares.
import { fetchUsers } from './api.js';
import { renderUsersCompact, updateCounts } from './render.js';
import { setupFilters, setupSearch } from './filters.js';
import { initializeModals, openUserModal, openDeleteModal, closeModalAndReload } from './modal.js';
import { setupForm } from './form.js';
import { showToast } from './utils.js';

// --- 2. ESTADO GLOBAL DO MÓDULO ---
// Uma variável para guardar a lista de usuários carregada da API.
// Isso evita ter que fazer novas requisições toda vez que filtramos ou buscamos.
let allUsers = [];

// --- 3. FUNÇÃO DE INICIALIZAÇÃO PRINCIPAL ---
/**
 * Função que prepara toda a interatividade da página.
 * É chamada uma única vez, quando a página termina de carregar.
 */
async function initializePage() {
    // Inicializa as instâncias dos modais do Bootstrap.
    initializeModals();

    // Configura o formulário para ouvir o evento de 'submit' e chama a função
    // closeModalAndReload após o sucesso, que por sua vez dispara o evento 'usersUpdated'.
    setupForm(closeModalAndReload);

    // CRIAÇÃO DA "PONTE" ENTRE HTML E JAVASCRIPT MODULAR
    // O HTML (onclick) não consegue acessar funções dentro de módulos diretamente.
    // Expor as funções que precisam ser chamadas pelo HTML em um objeto global (window) resolve isso.
    window.modalActions = {
        openUserModal: openUserModal,   // Agora o onclick="window.modalActions.openUserModal(userId)" funciona.
        openDeleteModal: openDeleteModal // Agora o onclick="window.modalActions.openDeleteModal(userId)" funciona.
    };

    // CRIA UM "OUVINTE DE EVENTOS" PERSONALIZADO
    // Quando o modal é fechado após uma ação (criar/editar/excluir), ele dispara um evento 'usersUpdated'.
    // Este listener "ouve" esse evento e chama a função loadUsers para recarregar a lista,
    // garantindo que a tela esteja sempre atualizada.
    document.addEventListener('usersUpdated', loadUsers);

    // Finalmente, carrega a lista inicial de usuários da API.
    await loadUsers();
}

// --- 4. FUNÇÃO DE ORQUESTRAÇÃO DE DADOS ---
/**
 * Orquestra o processo de carregar os usuários e atualizar a interface.
 * Esta função é o coração do fluxo de dados da página.
 */
async function loadUsers() {
    // Pega as referências dos elementos HTML que mostram os estados da página
    const listContainer = document.getElementById("usersCompactList");
    const loading = document.getElementById("loadingState");
    const empty = document.getElementById("emptyState");

    // Reseta a tela para o estado de "carregando"
    listContainer.innerHTML = '';
    loading.classList.remove('d-none');
    empty.classList.add('d-none');

    try {
        // Chama a função da API para buscar os dados no backend
        const users = await fetchUsers();
        allUsers = users; // Atualiza nosso cache local

        if (users.length === 0) {
            // Se não houver usuários, mostra o estado de "vazio"
            empty.classList.remove('d-none');
        } else {
            // Se houver usuários, comanda as outras funções para fazerem seu trabalho:
            renderUsersCompact(users); // Desenha os cards dos usuários
            updateCounts(users);       // Atualiza os números nos botões de filtro
            setupFilters();            // Ativa a lógica dos filtros
            setupSearch();             // Ativa a lógica da barra de busca
        }
    } catch (error) {
        // Se a API der erro, mostra uma mensagem de falha
        showToast(`Falha ao carregar dados: ${error.message}`, "error");
        empty.innerHTML = `<div class="p-4 text-center text-danger"><strong>Oops!</strong><br>Não foi possível carregar os usuários. Verifique sua conexão ou a API.</div>`;
        empty.classList.remove('d-none');
    } finally {
        // Independentemente de sucesso ou falha, esconde o spinner de "carregando"
        loading.classList.add('d-none');
    }
}

// --- 5. PONTO DE ENTRADA DO SCRIPT ---
// Este é o comando que efetivamente inicia tudo.
// Ele espera o HTML da página estar completamente carregado e então chama nossa função principal.
document.addEventListener("DOMContentLoaded", initializePage);