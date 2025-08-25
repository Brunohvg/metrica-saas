// rules_utils.js
let currentRuleData = null; // usado no gerenciamento de faixas

function getCSRFToken() {
    const csrfInput = document.querySelector('[name=csrfmiddlewaretoken]');
    return csrfInput ? csrfInput.value : '';
}

// Alertas Reutilizáveis
function showSuccessAlert(message, timer = 2000) {
    Swal.fire({
        icon: 'success',
        title: 'Sucesso!',
        text: message,
        timer: timer,
        showConfirmButton: false
    });
}

function showErrorAlert(message) {
    Swal.fire({
        icon: 'error',
        title: 'Erro!',
        text: message || 'Algo deu errado.'
    });
}

function showConfirmAlert(options = {}) {
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

// Atualizar página sem delay
function reloadPage() {
    location.reload();
}
