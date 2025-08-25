// apps/accounts/static/js/equipe/filters.js

/**
 * Configura os event listeners para os botões de filtro de tipo de usuário.
 */
export function setupFilters() {
    const filterButtons = document.querySelectorAll('input[name="filterType"]');
    filterButtons.forEach(btn => {
        btn.addEventListener('change', () => {
            applyFilters();
        });
    });
}

/**
 * Configura o event listener para o campo de busca.
 */
export function setupSearch() {
    const searchInput = document.getElementById('searchUsers');
    searchInput.addEventListener('input', () => {
        applyFilters();
    });
}

/**
 * Função central que aplica o filtro de tipo e o termo de busca.
 */
function applyFilters() {
    const filterValue = document.querySelector('input[name="filterType"]:checked').value;
    const searchTerm = document.getElementById('searchUsers').value.toLowerCase();
    const items = document.querySelectorAll('.user-item');
    const groups = document.querySelectorAll('.group-section');

    const visibleGroups = new Set();

    items.forEach(item => {
        const typeMatch = (filterValue === 'all' || item.dataset.userType === filterValue);
        
        const name = item.dataset.userName;
        const email = item.dataset.userEmail;
        const username = item.dataset.userUsername;
        const searchMatch = (
            name.includes(searchTerm) ||
            email.includes(searchTerm) ||
            username.includes(searchTerm)
        );

        if (typeMatch && searchMatch) {
            item.style.display = 'block';
            visibleGroups.add(item.dataset.userType);
        } else {
            item.style.display = 'none';
        }
    });
    
    // Mostra ou esconde os cabeçalhos dos grupos
    groups.forEach(group => {
        const groupType = group.dataset.groupType;
        if (filterValue === 'all' && visibleGroups.has(groupType)) {
             group.style.display = 'block';
        } else if (filterValue !== 'all' && filterValue === groupType) {
             group.style.display = 'block';
        } else {
            group.style.display = 'none';
        }
    });
}