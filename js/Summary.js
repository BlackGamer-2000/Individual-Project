/* Запускаем весь скрипт ТОЛЬКО после полной загрузки HTML-страницы */
window.addEventListener('DOMContentLoaded', function() {
    /* --- Достаём всю информацию о сборке --- */
    const savedData = localStorage.getItem('cyberBuild');
    /* Всё, что понадобится позже (будет отображено в html) */
    const summaryList = document.getElementById('summary-list');
    const summaryPrice = document.getElementById('summary-price');
    const verdictBox = document.getElementById('verdict-box');
    const verdictTitle = document.getElementById('verdict-title');
    const verdictText = document.getElementById('verdict-text');
    const btnPrint = document.getElementById('btn-print');
    /* Если в памяти ничего нет — останавливаем скрипт, чтобы не было ошибок */
    if (!savedData || !summaryList) return;

    const build = JSON.parse(savedData);
    let totalPrice = 0;
    let totalWattage = 0;
    let powerSupplyWattage = 0; // Сюда сохраним мощность выбранного Блока питания

    /* Очищаем контейнер перед выводом деталей (если новая сборка, все записанные ранее данные сотрутся) */
    summaryList.innerHTML = '';
    /* Пробегаемся по всем деталям из нашей памяти через функцию */
    build.forEach(function(part) {
        totalPrice += part.price;
        /* Если это Блок питания — запоминаем его мощность отдельно */
        if (part.type === 'power') {
            powerSupplyWattage = part.wattage;
        } else {
            /* Остальные детали суммируем в общую копилку прожорливости системы */
            totalWattage += part.wattage;
        }
        /* Переводим все названия комплектующих (не сами комплектующие, а что это) */
        let russianType = part.type;
        if (part.type === 'cpu') russianType = 'Процессор';
        if (part.type === 'motherboard') russianType = 'Материнская плата';
        if (part.type === 'cooling') russianType = 'Охлаждение';
        if (part.type === 'ram') russianType = 'Оперативная память';
        if (part.type === 'gpu') russianType = 'Видеокарта';
        if (part.type === 'ssd') russianType = 'Накопитель (SSD/HDD)';
        if (part.type === 'power') russianType = 'Блок питания';
        if (part.type === 'case') russianType = 'Корпус';
        /* Создаем div элементы в html с нужными классами (строкой ниже мы уже заполняем её информацией) */
        const itemRow = document.createElement('div');
        itemRow.className = 'summary-item d-flex justify-content-between align-items-center p-3 mb-2 rounded text-white';
        /* Наполняем те самые div информацией (название детали и её цена) */
        itemRow.innerHTML = `
            <div>
                <span class="text-uppercase text-info small d-block" style="font-size: 12px; letter-spacing: 1px;">${russianType}</span>
                <span class="fs-5 fw-bold">${part.name}</span>
            </div>
            <span class="fs-4 text-warning fw-bold">${part.price.toLocaleString('ru-RU')} ₽</span>
        `;
        /* Вставляем готовую строку на экран */
        summaryList.appendChild(itemRow);
    });
    /* Финальная стоимость */
    if (summaryPrice) {
        summaryPrice.textContent = totalPrice.toLocaleString('ru-RU') + ' ₽';
    }


    /* --- Последняя проверка - проверка мощности --- */
    if (verdictBox) {
        verdictBox.classList.remove('d-none'); /* Вердикт по поводу сборки */
        /* Проверка на потребление мощности */
        if (totalWattage >= powerSupplyWattage || powerSupplyWattage === 0) {
            /* Если компьютер употребляет больше, чем разрешает блок питания */
            verdictBox.className = 'alert alert-danger p-4 mb-5 text-center';
            verdictTitle.textContent = '🚨 КРИТИЧЕСКАЯ ОШИБКА СОВМЕСТИМОСТИ';
            verdictText.textContent = `Ваша система потребляет ${totalWattage} Вт, а выбранный Блок Питания выдает всего ${powerSupplyWattage} Вт! Компьютер будет аварийно отключаться под нагрузкой. Вернитесь в конструктор и выберите более мощный БП.`;
        } else {
            /* Если всё отлично */
            verdictBox.className = 'alert alert-success p-4 mb-5 text-center';
            verdictTitle.textContent = '✅ ПРОВЕРКА СИСТЕМЫ ПРОЙДЕНА';
            verdictText.textContent = `Энергосистема сбалансирована. Компоненты потребляют ${totalWattage} Вт. Мощности Блока Питания (${powerSupplyWattage} Вт) хватает с запасом. Сборка готова к работе!`;
        }
    }
    /* Кнопка Печати */
    if (btnPrint) {
        btnPrint.addEventListener('click', function() {
            window.print(); /* Открывает системное окно печати у браузера */
        });
    }
});