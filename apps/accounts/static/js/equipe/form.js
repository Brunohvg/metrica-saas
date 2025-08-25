// apps/accounts/static/js/equipe/form.js

import { saveUser } from './api.js';
import { showToast } from './utils.js';

/**
 * Configura os event listeners para a submissão do formulário.
 * @param {function} onFormSubmit - Callback a ser executado após a submissão bem-sucedida.
 */
export function setupForm(onFormSubmit) {
    const form = document.getElementById("userForm");
    form.addEventListener("submit", (event) => handleFormSubmit(event, onFormSubmit));
    setupFormValidation();
    setupPasswordStrength();
}

/**
 * Lida com a submissão do formulário, valida os dados e chama a API.
 * @param {Event} event - O evento de submissão.
 * @param {function} callback - Função a ser chamada após o sucesso.
 */
async function handleFormSubmit(event, callback) {
    event.preventDefault();
    const form = event.target;

    if (!isFormValid(form)) {
        showToast("Por favor, corrija os campos destacados", "error");
        return;
    }

    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    try {
        await saveUser(payload);
        const successMessage = payload.id ? "Usuário atualizado com sucesso!" : "Usuário cadastrado com sucesso!";
        showToast(successMessage);
        callback(); // Chama o callback para fechar o modal e recarregar a lista
    } catch (error) {
        showToast(`Erro: ${error.message}`, "error");
    }
}

/**
 * Configura a validação em tempo real para os campos do formulário.
 */
function setupFormValidation() {
    const form = document.getElementById("userForm");
    const inputs = form.querySelectorAll('input[required], select[required]');

    inputs.forEach(input => {
        input.addEventListener('blur', (e) => validateField(e.target));
        input.addEventListener('input', (e) => validateField(e.target));
    });
}

/**
 * Valida um único campo do formulário e aplica classes CSS.
 * @param {HTMLElement} field - O campo a ser validado.
 * @returns {boolean} - True se o campo for válido.
 */
function validateField(field) {
    const value = field.value.trim();
    field.classList.remove('is-valid', 'is-invalid');

    if (field.hasAttribute('required') && !value) {
        field.classList.add('is-invalid');
        return false;
    }

    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            field.classList.add('is-invalid');
            return false;
        }
    }

    if (value) {
        field.classList.add('is-valid');
    }
    return true;
}

/**
 * Verifica se todos os campos obrigatórios do formulário são válidos.
 * @param {HTMLFormElement} form - O formulário.
 * @returns {boolean} - True se o formulário for válido.
 */
function isFormValid(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('input[required], select[required]');
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    return isValid;
}

/**
 * Configura o medidor de força da senha.
 */
function setupPasswordStrength() {
    const passwordField = document.getElementById('password');
    const strengthBar = document.getElementById('passwordStrengthBar');
    const helpText = document.getElementById('passwordHelp');

    passwordField.addEventListener('input', (e) => {
        const password = e.target.value;
        const strength = calculatePasswordStrength(password);

        strengthBar.className = 'password-strength-bar';
        helpText.style.color = 'inherit';

        if (password.length === 0) {
            helpText.textContent = 'Mínimo 8 caracteres';
            return;
        }

        switch (strength) {
            case 1:
                strengthBar.classList.add('strength-weak');
                helpText.textContent = 'Senha fraca';
                helpText.style.color = '#EF4444';
                break;
            case 2:
                strengthBar.classList.add('strength-medium');
                helpText.textContent = 'Senha média';
                helpText.style.color = '#F59E0B';
                break;
            case 3:
                strengthBar.classList.add('strength-strong');
                helpText.textContent = 'Senha forte';
                helpText.style.color = '#10B981';
                break;
        }
    });
}

/**
 * Calcula a "força" de uma senha com base em alguns critérios.
 * @param {string} password - A senha.
 * @returns {number} - Um score de 0 a 3.
 */
function calculatePasswordStrength(password) {
    if (password.length < 4) return 0;
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return Math.min(Math.floor(score / 2), 3);
}