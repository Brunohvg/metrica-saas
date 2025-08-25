// apps/accounts/static/js/equipe/api.js

import { getCookie } from './utils.js';

const API_URL = "/api/v1/users/";
const CSRF_TOKEN = getCookie('csrftoken');

/**
 * Busca a lista completa de usuários da API.
 * @returns {Promise<Array>}
 */
export async function fetchUsers() {
    const response = await fetch(API_URL);
    if (!response.ok) {
        throw new Error('Falha ao buscar usuários da API.');
    }
    return await response.json();
}

// ==================================================================
// === FUNÇÃO NOVA ADICIONADA AQUI ===
// ==================================================================
/**
 * Busca os dados de um único usuário pelo seu ID.
 * @param {string} userId - O ID do usuário.
 * @returns {Promise<object>} - Uma promessa que resolve para os dados do usuário.
 */
export async function fetchUserById(userId) {
    const response = await fetch(`${API_URL}${userId}/`);
    if (!response.ok) {
        throw new Error('Usuário não encontrado.'); // Esta é a fonte do erro que você viu
    }
    return await response.json();
}
// ==================================================================

/**
 * Salva um usuário (cria um novo ou atualiza um existente).
 * @param {object} payload - Os dados do usuário.
 * @returns {Promise<object>}
 */
export async function saveUser(payload) {
    const userId = payload.id;
    const method = userId ? "PATCH" : "POST";
    const url = userId ? `${API_URL}${userId}/` : API_URL;

    if (userId && !payload.password) delete payload.password;
    if (!userId) delete payload.id;
    // A linha abaixo estava no seu código original, mas é melhor que o payload já venha correto.
    // Vamos garantir que o is_active seja parte do payload antes de chegar aqui.
    // payload.is_active = document.getElementById('is_active').checked;

    const response = await fetch(url, {
        method,
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": CSRF_TOKEN
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = Object.entries(errorData)
            .map(([field, errors]) => `${field.replace("_", " ")}: ${errors.join(', ')}`)
            .join('; ');
        throw new Error(errorMessage || 'Erro desconhecido ao salvar.');
    }
    return await response.json();
}

/**
 * Exclui um usuário da API.
 * @param {string} userId - O ID do usuário.
 * @returns {Promise<Response>}
 */
export async function deleteUserAPI(userId) {
    const response = await fetch(`${API_URL}${userId}/`, {
        method: "DELETE",
        headers: { "X-CSRFToken": CSRF_TOKEN }
    });

    if (!response.ok) {
        throw new Error('Falha ao excluir usuário.');
    }
    return response;
}