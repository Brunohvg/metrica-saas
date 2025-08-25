// apps/accounts/static/js/equipe/utils.js

/**
 * Pega o valor de um cookie específico pelo nome.
 * Essencial para obter o CSRF Token para requisições seguras.
 * @param {string} name - O nome do cookie.
 * @returns {string|null} - O valor do cookie ou null se não encontrado.
 */
export const getCookie = (name) => document.cookie.match(`[; ]?${name}=([^;]*)`)?.[1] || null;

/**
 * Gera as iniciais a partir do nome completo ou username do usuário.
 * Ex: "Bruno Silva" -> "BS"
 * @param {object} user - O objeto do usuário.
 * @returns {string} - As iniciais em maiúsculo.
 */
export const getInitials = (user) => {
    const fullName = (user.first_name || user.username || '').trim();
    const parts = fullName.split(' ').filter(p => p);
    if (parts.length > 1) {
        return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    }
    return fullName.substring(0, 2).toUpperCase() || '?';
};

/**
 * Retorna o nome de exibição principal do usuário.
 * Prioriza o 'first_name', mas usa 'username' como fallback.
 * @param {object} user - O objeto do usuário.
 * @returns {string} - O nome de exibição.
 */
export const getDisplayName = (user) => (user.first_name || user.username).trim();

/**
 * Exibe uma notificação 'toast' no canto da tela usando SweetAlert2.
 * @param {string} title - O título da notificação.
 * @param {string} icon - O ícone ('success', 'error', 'warning', 'info').
 */
export const showToast = (title, icon = 'success') => {
    Swal.fire({
        title,
        icon,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true
    });
};

/**
 * Retorna o nome do ícone (Tabler Icons) para um tipo de usuário.
 * @param {string} type - A sigla do tipo de usuário (ex: 'GE', 'VE').
 * @returns {string} - O nome do ícone.
 */
export const getTypeIcon = (type) => {
    const icons = {
        'GE': 'crown',
        'VE': 'briefcase',
        'CX': 'cash',
        'CT': 'calculator'
    };
    return icons[type] || 'user';
};