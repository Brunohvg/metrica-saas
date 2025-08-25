// apps/commissions/static/js/rules/filters.js

/**
 * Atualiza os contadores de regras nos botões de filtro.
 */
function updateCounts() {
    const rules = document.querySelectorAll('.rule-item');
    const counts = { all: 0, FLAT: 0, TIERED: 0, BONUS: 0 };

    rules.forEach(rule => {
        counts.all++;
        // Garante que a contagem só aconteça se a chave existir
        if (counts.hasOwnProperty(rule.dataset.ruleType)) {
            counts[rule.dataset.ruleType]++;
        }
    });

    document.getElementById('countAll').textContent = counts.all;
    document.getElementById('countFlat').textContent = counts.FLAT;
    document.getElementById('countTiered').textContent = counts.TIERED;
    document.getElementById('countBonus').textContent = counts.BONUS;
}

/**
 * Aplica os filtros (tipo e busca) na lista de regras.
 */
function applyFilters() {
    const filterValue = document.querySelector('input[name="filterType"]:checked').value;
    const searchTerm = document.getElementById('searchRules').value.toLowerCase();
    
    document.querySelectorAll('.rule-item').forEach(item => {
        const typeMatch = (filterValue === 'all' || item.dataset.ruleType === filterValue);
        const name = item.dataset.ruleName.toLowerCase();
        const desc = item.dataset.ruleDesc.toLowerCase();
        const searchMatch = (name.includes(searchTerm) || desc.includes(searchTerm));
        
        item.style.display = (typeMatch && searchMatch) ? 'block' : 'none';
    });
}

/**
 * Configura os event listeners para os filtros e a barra de busca.
 */
export function setupFiltersAndSearch() {
    updateCounts(); // Atualiza a contagem inicial

    document.querySelectorAll('input[name="filterType"]').forEach(btn => {
        btn.addEventListener('change', applyFilters);
    });

    const searchInput = document.getElementById('searchRules');
    searchInput.addEventListener('input', applyFilters);
}