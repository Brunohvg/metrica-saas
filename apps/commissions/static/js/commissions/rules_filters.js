// rules_filters.js

document.addEventListener("DOMContentLoaded", function () {
    updateCounts();
    setupFilters();
    setupSearch();
});

// Atualiza contadores
function updateCounts() {
    const rules = document.querySelectorAll('.rule-item');
    let counts = { all: 0, FLAT: 0, TIERED: 0, BONUS: 0 };

    rules.forEach(rule => {
        counts.all++;
        counts[rule.dataset.ruleType]++;
    });

    document.getElementById('countAll').textContent = counts.all;
    document.getElementById('countFlat').textContent = counts.FLAT;
    document.getElementById('countTiered').textContent = counts.TIERED;
    document.getElementById('countBonus').textContent = counts.BONUS;
}

// Filtrar por tipo
function setupFilters() {
    document.querySelectorAll('input[name="filterType"]').forEach(btn => {
        btn.addEventListener('change', () => {
            const filterValue = btn.value;
            document.querySelectorAll('.rule-item').forEach(item => {
                item.style.display = (filterValue === 'all' || item.dataset.ruleType === filterValue) ? 'block' : 'none';
            });
        });
    });
}

// Busca por nome/descrição
function setupSearch() {
    const searchInput = document.getElementById('searchRules');
    searchInput.addEventListener('input', e => {
        const term = e.target.value.toLowerCase();
        document.querySelectorAll('.rule-item').forEach(item => {
            const name = item.dataset.ruleName;
            const desc = item.dataset.ruleDesc;
            item.style.display = (name.includes(term) || desc.includes(term)) ? 'block' : 'none';
        });
    });
}
