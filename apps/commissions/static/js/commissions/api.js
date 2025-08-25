// apps/commissions/static/js/rules/api.js

import { getCSRFToken } from './utils.js';

const API_URL = "/api/v1/commissions/rules/";
const CSRF_TOKEN = getCSRFToken();

/**
 * Busca os dados de uma regra específica.
 * @param {number} ruleId - O ID da regra.
 * @returns {Promise<object>} - Os dados da regra.
 */
export async function fetchRuleById(ruleId) {
    const response = await fetch(`${API_URL}${ruleId}/`);
    if (!response.ok) {
        throw new Error('Não foi possível carregar os dados da regra.');
    }
    return await response.json();
}

/**
 * Cria uma nova regra de comissão.
 * @param {object} data - Os dados da nova regra.
 * @returns {Promise<object>} - Os dados da regra criada.
 */
export async function createRule(data) {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRFToken': CSRF_TOKEN },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        throw new Error('Não foi possível criar a regra.');
    }
    return await response.json();
}

/**
 * Atualiza uma regra existente (PUT ou PATCH).
 * @param {number} ruleId - O ID da regra.
 * @param {object} data - Os dados a serem atualizados.
 * @returns {Promise<object>} - Os dados da regra atualizada.
 */
export async function updateRule(ruleId, data) {
    const response = await fetch(`${API_URL}${ruleId}/`, {
        method: 'PUT', // Ou PATCH, dependendo da sua API
        headers: { 'Content-Type': 'application/json', 'X-CSRFToken': CSRF_TOKEN },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        throw new Error('Não foi possível atualizar a regra.');
    }
    return await response.json();
}

/**
 * Exclui uma regra de comissão.
 * @param {number} ruleId - O ID da regra.
 */
export async function deleteRuleAPI(ruleId) {
    const response = await fetch(`${API_URL}${ruleId}/`, {
        method: 'DELETE',
        headers: { 'X-CSRFToken': CSRF_TOKEN }
    });
    if (!response.ok) {
        throw new Error('Não foi possível excluir a regra.');
    }
}