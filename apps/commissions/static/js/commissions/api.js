// apps/commissions/static/js/rules/api.js

import { getCSRFToken } from './utils.js';

const API_URL = "/api/v1/commissions/rules/";
const CSRF_TOKEN = getCSRFToken();

/**
 * Busca os dados de uma regra específica.
 * @param {number} ruleId - O ID da regra.
 * @returns {Promise<object>}
 */
export async function fetchRuleById(ruleId) {
    const response = await fetch(`${API_URL}${ruleId}/`);
    if (!response.ok) {
        throw new Error('Não foi possível carregar os dados da regra.');
    }
    return await response.json();
}

/**
 * Cria uma nova regra.
 * @param {object} data - Os dados da nova regra.
 * @returns {Promise<object>}
 */
export async function createRule(data) {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRFToken': CSRF_TOKEN },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || 'Não foi possível criar a regra.');
    }
    return await response.json();
}

/**
 * Atualiza uma regra existente.
 * @param {number} ruleId - O ID da regra.
 * @param {object} data - Os dados a serem atualizados.
 * @returns {Promise<object>}
 */
export async function updateRule(ruleId, data) {
    const response = await fetch(`${API_URL}${ruleId}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'X-CSRFToken': CSRF_TOKEN },
        body: JSON.stringify(data)
    });
    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || 'Não foi possível atualizar a regra.');
    }
    return await response.json();
}

/**
 * Exclui uma regra.
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