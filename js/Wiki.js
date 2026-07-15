const toggleBtn = document.getElementById('toggle-btn');
    const myCollapse = document.getElementById('moboMoreText');
    if (toggleBtn && myCollapse) {
        myCollapse.addEventListener('shown.bs.collapse', () => {
            toggleBtn.textContent = 'Свернуть';
        });
        myCollapse.addEventListener('hidden.bs.collapse', () => {
            toggleBtn.textContent = 'Развернуть';
        });
    };
const filterButtonsContainer = document.getElementById('filter-buttons');
    const cards = document.querySelectorAll('.wiki-card');
    if (filterButtonsContainer && cards.length > 0) {
        const buttons = filterButtonsContainer.querySelectorAll('button');
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                buttons.forEach(btn => {
                    btn.classList.remove('btn-warning', 'active');
                    btn.classList.add('btn-outline-info');
                });
                button.classList.remove('btn-outline-info');
                button.classList.add('btn-warning', 'active');
                const filterValue = button.getAttribute('data-filter');
                cards.forEach(card => {
                    const cardCategory = card.getAttribute('data-category');
                    if (filterValue === 'all') {
                        card.classList.remove('d-none');
                    }
                    else if (cardCategory && cardCategory.includes(filterValue)) {
                        card.classList.remove('d-none');
                    }
                    else {
                        card.classList.add('d-none');
                    }
                });

            });
        });
    };