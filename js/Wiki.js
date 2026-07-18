/* --- Кнопка Свернуть/Развернуть --- */
const collapseBtn = document.getElementById('collapse-btn');
const motherboardCollapse = document.getElementById('motherboard-text');
if (collapseBtn && motherboardCollapse) {
    motherboardCollapse.addEventListener('shown.bs.collapse', () => {
        collapseBtn.textContent = 'Свернуть';
    });
    motherboardCollapse.addEventListener('hidden.bs.collapse', () => {
        collapseBtn.textContent = 'Развернуть';
    });
};


/* --- Фильтр карточек --- */
const filterBtn = document.getElementById('filter-btn');
const cards = document.querySelectorAll('.wiki-card');
if (filterBtn && cards.length > 0) {
    const buttons = filterBtn.querySelectorAll('button');

    /* 1. Берем все кнопки и для каждой кнопки запускаем функцию при клике */
    buttons.forEach(function(button) {
        button.addEventListener('click', function() {
            
            /* 2. Сбрасываем стили у всех кнопок (для каждой кнопки запускаем сброс) */
            buttons.forEach(function(btn) {
                btn.classList.remove('btn-warning', 'active');
                btn.classList.add('btn-outline-info');
            });

            /* 3. Активируем ту кнопку, на которую только что кликнули */
            button.classList.remove('btn-outline-info');
            button.classList.add('btn-warning', 'active');

            /* 4. Забираем значение фильтра (all, CPU, GPU и т.д.) */
            const filterValue = button.getAttribute('data-filter');

            /* 5. Берем все карточки и для каждой карточки (card) проверяем условия */
            cards.forEach(function(card) {
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
}