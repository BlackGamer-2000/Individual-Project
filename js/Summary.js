window.addEventListener('DOMContentLoaded', () => {

// 1. Достаем строку из памяти браузера по нашему ключу 'cyberBuild'
    const savedData = localStorage.getItem('cyberBuild');
    
    // Находим пустые гнезда в HTML по их ID
    const summaryList = document.getElementById('summary-list');
    const summaryPrice = document.getElementById('summary-price');
    const verdictBox = document.getElementById('verdict-box');
    const verdictTitle = document.getElementById('verdict-title');
    const verdictText = document.getElementById('verdict-text');
    const btnPrint = document.getElementById('btn-print');

    // Если в памяти ничего нет — останавливаем скрипт, чтобы не было ошибок
    if (!savedData || !summaryList) return;

    // Распаковываем строку обратно в удобный массив объектов
    const build = JSON.parse(savedData);

    let totalPrice = 0;
    let totalWattage = 0;
    let powerSupplyWattage = 0; // Сюда сохраним мощность выбранного БП

    // Очищаем контейнер перед выводом деталей
    summaryList.innerHTML = '';

    // Циклом пробегаемся по всем деталям из нашей памяти
    build.forEach(part => {
        totalPrice += part.price;

        // Если это Блок питания — запоминаем его мощность отдельно
        if (part.type === 'power') {
            powerSupplyWattage = part.wattage;
        } else {
            // Остальные детали суммируем в общую копилку прожорливости системы
            totalWattage += part.wattage;
        }

        // 🔥 МАГИЯ: JS сам создает те самые плашки .summary-item, на которые ругалось расширение!
        const itemRow = document.createElement('div');
        itemRow.className = 'summary-item d-flex justify-content-between align-items-center p-3 mb-2 rounded text-white';
        
        // Внутреннее наполнение строки (название детали и её цена)
        itemRow.innerHTML = `
            <div>
                <span class="text-uppercase text-info small d-block">${part.type}</span>
                <span class="fs-5 fw-bold">${part.name}</span>
            </div>
            <span class="fs-4 text-warning fw-bold">${part.price.toLocaleString('ru-RU')} ₽</span>
        `;

        // Вставляем готовую строку на экран
        summaryList.appendChild(itemRow);
    });

    // Выводим общую финальную стоимость
    summaryPrice.textContent = totalPrice.toLocaleString('ru-RU') + ' ₽';

    // === АЛГОРИТМ ПРОВЕРКИ БЛОКА ПИТАНИЯ (Главная фишка проекта!) ===
    if (verdictBox) {
        verdictBox.classList.remove('d-none'); // Показываем блок вердикта на экране

        // ПРОВЕРКА УСЛОВИЯ: Если аппетит системы больше или впритык к мощности БП
        if (totalWattage >= powerSupplyWattage) {
            // Красим блок в опасный красный цвет Bootstrap
            verdictBox.className = 'alert alert-danger p-4 mb-5 text-center';
            verdictTitle.textContent = '🚨 КРИТИЧЕСКАЯ ОШИБКА СОВМЕСТИМОСТИ';
            verdictText.textContent = `Ваша система потребляет ${totalWattage} Вт, а выбранный Блок Питания выдает всего ${powerSupplyWattage} Вт! Компьютер будет аварийно отключаться под нагрузкой. Вернитесь в конструктор и выберите более мощный БП.`;
        } else {
            // Если всё отлично — красим блок в сочный зеленый цвет
            verdictBox.className = 'alert alert-success p-4 mb-5 text-center';
            verdictTitle.textContent = '✅ ПРОВЕРКА СИСТЕМЫ ПРОЙДЕНА';
            verdictText.textContent = `Энергосистема сбалансирована. Компоненты потребляют ${totalWattage} Вт. Мощности Блока Питания (${powerSupplyWattage} Вт) хватает с запасом. Сборка готова к работе!`;
        }
    }

    // ЛОГИКА КНОПКИ ПЕЧАТИ
    if (btnPrint) {
        btnPrint.addEventListener('click', () => {
            window.print(); // Открывает стандартное системное окно печати браузера
        });
    };
});