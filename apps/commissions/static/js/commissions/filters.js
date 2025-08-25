// apps/commissions/static/js/rules/filters.js

function updateCounts() {
    const rules = document.querySelectorAll('.rule-item');
    let counts = { all: rules.length, FLAT: 0, TIERED: 0, BONUS: 0 };

    rules.forEach(rule => {
        if (counts.hasOwnProperty(rule.dataset.ruleType)) {
            counts[rule.dataset.ruleType]++;
        }
    });

    document.getElementById('countAll').textContent = counts.all;
    document.getElementById('countFlat').textContent = counts.FLAT;
    document.getElementById('countTiered').textContent = counts.TIERED;
    document.getElementById('countBonus').textContent = counts.BONUS;
}

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

export function setupFiltersAndSearch() {
    updateCounts();

    document.querySelectorAll('input[name="filterType"]').forEach(btn => {
        btn.addEventListener('change', applyFilters);
    });

    const searchInput = document.getElementById('searchRules');
    searchInput.addEventListener('input', applyFilters);
}