// apps/commissions/static/js/rules/utils.js

/**
 * Pega o valor do cookie CSRF.
 * @returns {string} O token.
 */
export function getCSRFToken() {
    const csrfInput = document.querySelector('[name=csrfmiddlewaretoken]');
    return csrfInput ? csrfInput.value : '';
}

/**
 * Exibe um alerta de sucesso.
 * @param {string} message - A mensagem a ser exibida.
 * @param {number} timer - Duração.
 */
export function showSuccessAlert(message, timer = 2000) {
    Swal.fire({
        icon: 'success',
        title: 'Sucesso!',
        text: message,
        timer: timer,
        showConfirmButton: false
    });
}

/**
 * Exibe um alerta de erro.
 * @param {string} message - A mensagem de erro.
 */
export function showErrorAlert(message) {
    Swal.fire({
        icon: 'error',
        title: 'Erro!',
        text: message || 'Algo deu errado.'
    });
}

/**
 * Exibe um modal de confirmação.
 * @param {object} options - Opções de configuração.
 * @returns {Promise}
 */
export function showConfirmAlert(options = {}) {
    return Swal.fire({
        title: options.title || 'Tem certeza?',
        text: options.text || 'Esta ação não pode ser desfeita!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: options.confirmButtonColor || '#DC2626',
        cancelButtonColor: options.cancelButtonColor || '#6B7280',
        confirmButtonText: options.confirmButtonText || 'Sim, confirmar!',
        cancelButtonText: options.cancelButtonText || 'Cancelar'
    });
}

/**
 * Recarrega a página.
 */
export function reloadPage() {
    location.reload();
}