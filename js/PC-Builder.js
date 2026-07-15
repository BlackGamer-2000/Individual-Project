const pcIcon = document.getElementById('pc-icon');
const products = [
    // === 1. ПРОЦЕССОРЫ (CPU) ===
    {
        id: 1,
        name: "Intel Core i5-12400F",
        type: "cpu",
        price: 12000,
        wattage: 65,
        socket: "LGA1700",
        img: "./img/parts/i5.jpg"
    },
    {
        id: 2,
        name: "AMD Ryzen 5 7600X",
        type: "cpu",
        price: 22000,
        wattage: 105,
        socket: "AM5",
        img: "./img/parts/ryzen5.jpg"
    },

    // === 2. МАТЕРИНСКИЕ ПЛАТЫ (Motherboard) ===
    {
        id: 3,
        name: "ASUS PRIME B660M-K",
        type: "motherboard",
        price: 10000,
        wattage: 0, // Сама плата почти не ест, оставляем 0
        socket: "LGA1700", // Подойдет только к Intel i5!
        img: "./img/parts/prime-b660.jpg"
    },
    {
        id: 4,
        name: "GIGABYTE B650 GAMING X",
        type: "motherboard",
        price: 18000,
        wattage: 0,
        socket: "AM5", // Подойдет только к Ryzen 5!
        img: "./img/parts/b650.jpg"
    },

    // === 3. ОХЛАЖДЕНИЕ (Cooling) ===
    {
        id: 5,
        name: "DeepCool GAMMAXX 400 V2",
        type: "cooling",
        price: 2500,
        wattage: 4,
        socket: "LGA1700 AM5", // Универсальный кулер, подходит ко всему
        img: "./img/parts/gammaxx.jpg"
    },

    // === 4. ВИДЕОКАРТЫ (GPU) ===
    {
        id: 6,
        name: "NVIDIA GeForce RTX 4060",
        type: "gpu",
        price: 35000,
        wattage: 115, // А вот тут ватты очень важны!
        socket: "any", // Видеокарте плевать на сокет
        img: "./img/parts/rtx4060.jpg"
    },

    // === 5. БЛОКИ ПИТАНИЯ (Power Supply) ===
    {
        id: 7,
        name: "DeepCool PF600 600W",
        type: "power",
        price: 4500,
        wattage: 600, // Для БП это его МАКСИМАЛЬНАЯ мощность выдачи
        socket: "any",
        img: "./img/parts/pf600.jpg"
    },

    // === 6. КОРПУСА (Case) ===
    {
        id: 8,
        name: "Zalman i3 Neo Black",
        type: "case",
        price: 5500,
        wattage: 0,
        socket: "any",
        img: "./img/parts/zalman.jpg"
    }
];

const stepsMenu = document.getElementById('steps-menu');
const stepContents = document.querySelectorAll('.step-content');

if (stepsMenu) {
    // Находим все левые кнопки-шаги
    const buttons = stepsMenu.querySelectorAll('.list-group-item');

    buttons.forEach(button => {
        button.addEventListener('click', () => {
                
            // Действие А: Переключаем оранжевую подсветку у левых кнопок
            buttons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
                
            // Действие Б: Считываем шаг кнопки (например: cpu, motherboard, cooling)
            const targetStep = button.getAttribute('data-step');
                
            // Действие В: Прячем абсолютно все коробки товаров справа (накидываем d-none)
            stepContents.forEach(content => content.classList.add('d-none'));
                
            // Действие Г: Открываем именно ту коробку, которая подходит под наш шаг!
            const activeBox = document.getElementById('step-' + targetStep);
            if (activeBox) {
                activeBox.classList.remove('d-none'); // Убираем d-none [1]
            }
                
            console.log("Отображаем каталог для шага: " + targetStep);
        });
    });
};


// === КУЗНИЦА ДАННЫХ: ПОДСЧЕТ СТОИМОСТИ И МОЩНОСТИ ===

// 1. Находим элементы верхнего табло, куда будем выводить живые цифры
const totalPriceElement = document.getElementById('total-price');
const totalWattageElement = document.getElementById('total-wattage');

// 2. Создаем объект-память, куда будем сохранять данные выбранной детали на каждом шаге
let selectedBuild = {
    cpu: { price: 0, wattage: 0 },
    motherboard: { price: 0, wattage: 0 },
    cooling: { price: 0, wattage: 0 },
    gpu: { price: 0, wattage: 0 },
    power: { price: 0, wattage: 0 },
    case: { price: 0, wattage: 0 }
};

// 3. Находим ВСЕ кнопки «Выбрать» во всех карточках товаров
const selectButtons = document.querySelectorAll('.btn-select');

selectButtons.forEach(button => {
    button.addEventListener('click', () => {
        
        // Считываем тип детали (cpu, gpu и т.д.), чтобы знать, в какую ячейку памяти её записать
        const partType = button.getAttribute('data-type');
        
        // Считываем цену и ватты из data-атрибутов нажатой кнопки (превращаем текст в числа через parseInt)
        const price = parseInt(button.getAttribute('data-price')) || 0;
        const wattage = parseInt(button.getAttribute('data-wattage')) || 0;

        // ШАГ А: Переключаем внешний вид кнопок ТЕКУЩЕЙ категории
        // Находим все кнопки в ЭТОЙ ЖЕ коробке товара и сбрасываем их
        const currentBox = document.getElementById('step-' + partType);
        const boxButtons = currentBox.querySelectorAll('.btn-select');
        
        boxButtons.forEach(btn => {
            btn.classList.remove('btn-success', 'active');
            btn.classList.add('btn-outline-info');
            btn.textContent = 'Выбрать';
        });

        // Делаем нажатую кнопку зеленой и пишем «Выбрано»
        button.classList.remove('btn-outline-info');
        button.classList.add('btn-success', 'active');
        button.textContent = 'Выбрано';

        // ШАГ Б: Записываем новые данные в нашу память вместо старых
        selectedBuild[partType].price = price;
        selectedBuild[partType].wattage = wattage;

        // ШАГ В: Пересчитываем общую сумму
        let finalPrice = 0;
        let finalWattage = 0;

        // Циклом пробегаемся по нашей памяти и складываем все цифры
        for (let key in selectedBuild) {
            finalPrice += selectedBuild[key].price;
            
            // Хитрость: Блок питания выдает ватты, а не потребляет их. 
            // Поэтому ватты БП мы не плюсуем к потреблению системы!
            if (key !== 'power') {
                finalWattage += selectedBuild[key].wattage;
            }
        }

        // ШАГ Г: Выводим новые живые цифры на верхнее табло
        totalPriceElement.textContent = finalPrice.toLocaleString('ru-RU') + ' ₽';
        totalWattageElement.textContent = finalWattage + ' Вт';

        checkBuildReady();
    });
});

// === ФИНАЛЬНЫЙ СТАТУС И СБОРКА ПК ===

// 1. Находим нашу главную кнопку финала по её ID
const btnForge = document.getElementById('btn-forge');
const builderStatus = document.getElementById('builder-status');

// 2. Создаем функцию, которая проверяет, готов ли компьютер к ковке
function checkBuildReady() {
    let chosenCount = 0;

    // Считаем, сколько категорий заполнено ценой больше нуля
    for (let key in selectedBuild) {
        if (selectedBuild[key].price > 0) {
            chosenCount++;
        }
    }

    // Обновляем живой индикатор в шапке (например: 1/6, 3/6, 6/6)
    if (builderStatus) {
        builderStatus.textContent = chosenCount + ' / 6';
    }

    // Если выбраны ВСЕ 6 компонентов, активируем кнопку финала!
    if (chosenCount === 6) {
        btnForge.classList.remove('disabled'); // Убираем серую блокировку Bootstrap
        btnForge.classList.add('animate__animated', 'animate__pulse', 'animate__infinite'); // Добавляем пульсацию из Animate.css!
        if (pcIcon) {
            pcIcon.classList.remove('text-muted'); // Стираем серый цвет
            pcIcon.classList.add('text-warning'); // Включаем оранжевый неон!
            pcIcon.style.filter = 'drop-shadow(0 0 15px #ff7300)'; // Добавляем сочное неоновое свечение
        }
    } else {
        btnForge.classList.add('disabled');
        btnForge.classList.remove('animate__animated', 'animate__pulse', 'animate__infinite');
        if (pcIcon) {
            pcIcon.classList.remove('text-warning');
            pcIcon.classList.add('text-muted');
            pcIcon.style.filter = 'none'; // Выключаем неон
        }
    }
}

// 3. Вызываем эту проверку СРАЗУ внутри каждого клика по кнопке «Выбрать»!
// Найди в своем коде место, где ты выводишь новые цифры на табло, и в самом низу этого клика допиши:
// checkBuildReady(); 


// 4. Логика клика по самой кнопке «ВЫКОВАТЬ ПК»
if (btnForge) {
    btnForge.addEventListener('click', () => {
        // Если кнопка серая и заблокирована — ничего не делаем
        if (btnForge.classList.contains('disabled')) return;

        let finalComponents = [];
        
        // Вместо поиска классов в HTML, мы просто берем твой готовый объект-память, 
        // который к этому моменту уже заполнился цифрами от твоих кликов!
        for (let key in selectedBuild) {
            // Находим зеленую (выбранную) кнопку в текущей категории, чтобы забрать у нее data-name
            const currentBox = document.getElementById('step-' + key);
            const activeButton = currentBox.querySelector('.btn-success');
            
            let partName = "Не выбрано";
            if (activeButton) {
                partName = activeButton.getAttribute('data-name'); // Забираем наше имя из HTML!
            }

            finalComponents.push({
                type: key,
                name: partName,
                price: selectedBuild[key].price,
                wattage: selectedBuild[key].wattage
            });
        }

        // Упаковываем наш массив в строчку и железно пишем в записную книжку браузера
        localStorage.setItem('cyberBuild', JSON.stringify(finalComponents));
        
        console.log("Сборка успешно выкована! Данные в памяти.");
        
        // Перенаправляем на страницу Итога
        window.location.href = './Summary.html';
    });
}