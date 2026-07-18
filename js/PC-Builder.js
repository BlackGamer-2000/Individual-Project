const pcIcon = document.getElementById('pc-icon');

/* Запускаем весь js код ТОЛЬКО после полной загрузки HTML-страницы (на всякий случай, ведь если это не сделать в summary.js, все данные твоей сборки не загрузятся)*/
window.addEventListener('DOMContentLoaded', function() {


    /* --- Навигация --- */
    const stepsMenu = document.getElementById('steps-menu');
    const stepContents = document.querySelectorAll('.step-content');

    if (stepsMenu) {
        /* Находим все левые кнопки внутри меню */
        const buttons = stepsMenu.querySelectorAll('.list-group-item');
        buttons.forEach(function(button) {
            button.addEventListener('click', function() {
                /* Сбрасываем оранжевую подсветку у абсолютно всех левых кнопок */
                buttons.forEach(function(btn) {
                    btn.classList.remove('active');
                });
                /* Зажигаем оранжевым именно ту кнопку, на которую кликнули */
                button.classList.add('active');
                /* Смотрим, какой у кнопки data-step (чтобы понимать, кого надо показывать) */
                const targetStep = button.getAttribute('data-step');
                /* Прячем абсолютно все коробки товаров справа */
                stepContents.forEach(function(content) {
                    content.classList.add('d-none');
                });
                /* Склеиваем ID и открываем именно ту коробку, которая подходит под нашу кнопку */
                const activeBox = document.getElementById('step-' + targetStep);
                if (activeBox) {
                    activeBox.classList.remove('d-none');
                }
            });
        });
    }


    /* --- Подсчёт стоимости и мощности --- */
    /* Находим элементы верхнего табло, куда будем выводить живые цифры */
    const totalPriceElement = document.getElementById('total-price');
    const totalWattageElement = document.getElementById('total-wattage');

    /* Создаем объект-память, куда будем сохранять данные выбранной детали на каждом шаге */
    let selectedBuild = {
        cpu: { price: 0, wattage: 0 },
        motherboard: { price: 0, wattage: 0 },
        cooling: { price: 0, wattage: 0 },
        ram: { price: 0, wattage: 0 }, 
        gpu: { price: 0, wattage: 0 },
        ssd: { price: 0, wattage: 0 },
        power: { price: 0, wattage: 0 },
        case: { price: 0, wattage: 0 }
    };

    /* Находим ВСЕ кнопки «Выбрать» во всех карточках товаров */
    const selectButtons = document.querySelectorAll('.btn-select');

    /* Пробегаемся по списку кнопок */
    selectButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            /* Считываем тип детали, чтобы знать, в какую ячейку памяти её записать */
            const partType = button.getAttribute('data-type');
            
            /* Считываем цену и ватты из data-атрибутов нажатой кнопки (переводим текст в числа) */
            const price = parseInt(button.getAttribute('data-price')) || 0;
            const wattage = parseInt(button.getAttribute('data-wattage')) || 0;
            
            /* Переключаем внешний вид кнопок ТЕКУЩЕЙ категории */
            /* Находим все кнопки в ЭТОЙ ЖЕ коробке товара и сбрасываем их */
            const currentBox = document.getElementById('step-' + partType);
            const boxButtons = currentBox.querySelectorAll('.btn-select');
            
            boxButtons.forEach(function(btn) {
                // Если на кнопке висит класс 'disabled', мы её просто игнорируем и не трогаем */
                if (!btn.classList.contains('disabled')) {
                    btn.classList.remove('btn-success', 'active');
                    btn.classList.add('btn-outline-info');
                    btn.textContent = 'Выбрать';
                }
            });
            
            /* Делаем нажатую кнопку зеленой и пишем «Выбрано» */
            button.classList.remove('btn-outline-info');
            button.classList.add('btn-success', 'active');
            button.textContent = 'Выбрано';
            
            /* Записываем новые данные в нашу память вместо старых */
            selectedBuild[partType].price = price;
            selectedBuild[partType].wattage = wattage;
            
            /* Пересчитываем общую сумму */
            let finalPrice = 0;
            let finalWattage = 0;
            
            /* Циклом пробегаемся по нашему объекту-памяти и складываем все цифры */
            for (let key in selectedBuild) {
                finalPrice += selectedBuild[key].price;
                /* Если текущая деталь — НЕ блок питания, то плюсуем ватты к потреблению */
                if (key !== 'power') {
                    finalWattage += selectedBuild[key].wattage;
                }
            }
            
            /* Выводим новые цифры (цена + потребление) на верхнее табло */
            totalPriceElement.textContent = finalPrice.toLocaleString('ru-RU') + ' ₽';
            totalWattageElement.textContent = finalWattage + ' Вт';
            
            /* Проверка материнской платы и оперативной памяти */
            if (partType === 'motherboard') {
                const motherType = button.getAttribute('data-ram');
                const ramBox = document.getElementById('step-ram');
                if (ramBox) {
                    const ramButtons = ramBox.querySelectorAll('.btn-select');
                    ramButtons.forEach(function(ramButton) {
                        const ramType = ramButton.getAttribute('data-ram');
                        const ramCard = ramButton.closest('.card');
                        if (motherType && ramType && !motherType.includes(ramType) && !ramType.includes(motherType)) {
                            ramButton.classList.add('disabled');
                            ramButton.textContent = 'Не совместимо';
                            ramCard.style.opacity = '0.4';
                        } else {
                            ramButton.classList.remove('disabled');
                            ramButton.textContent = 'Выбрать';
                            ramCard.style.opacity = '1';
                        }
                    });
                }
            }
            if (partType === 'ram') {
                const ramType = button.getAttribute('data-ram');
                const motherBox = document.getElementById('step-motherboard');
                if (motherBox) {
                    const motherButtons = motherBox.querySelectorAll('.btn-select');
                    motherButtons.forEach(function(motherButton) {
                        const motherType = motherButton.getAttribute('data-ram');
                        const motherCard = motherButton.closest('.card');
                        if (motherType && ramType && !motherType.includes(ramType) && !ramType.includes(motherType)) {
                            motherButton.classList.add('disabled');
                            motherButton.textContent = 'Не совместимо';
                            motherCard.style.opacity = '0.4';
                        } else {
                            motherButton.classList.remove('disabled');
                            motherButton.textContent = 'Выбрать';
                            motherCard.style.opacity = '1';
                        }
                    });
                }
            }
            
            /* Проверка процессора и охлаждения */
            if (partType === 'cpu') {
                const cpuSocket = button.getAttribute('data-socket');
                const coolingBox = document.getElementById('step-cooling');
                if (coolingBox) {
                    const coolingButtons = coolingBox.querySelectorAll('.btn-select');
                    /* Пробегаемся по всем кулерам */
                    coolingButtons.forEach(function(coolButton) {
                        const coolSocket = coolButton.getAttribute('data-socket');
                        const coolCard = coolButton.closest('.card');
                        /* Если список сокетов кулера НЕ включает в себя сокет нашего процессора */
                        if (coolSocket && !coolSocket.includes(cpuSocket)) {
                            coolButton.classList.add('disabled');
                            coolButton.textContent = 'Не совместимо';
                            coolCard.style.opacity = '0.4';
                        } else {
                            /* Если сокет процессора поддерживается кулером */
                            coolButton.classList.remove('disabled');
                            coolButton.textContent = 'Выбрать';
                            coolCard.style.opacity = '1';
                        }
                    });
                }
            }
            if (partType === 'cooling') {
                const coolSocket = button.getAttribute('data-socket');
                const cpuBox = document.getElementById('step-cpu');
                if (cpuBox) {
                    const cpuButtons = cpuBox.querySelectorAll('.btn-select');
                    /* Пробегаемся по всем кулерам */
                    cpuButtons.forEach(function(cpuButton) {
                        const cpuSocket = cpuButton.getAttribute('data-socket');
                        const cpuCard = cpuButton.closest('.card');
                        /* Если список сокетов кулера НЕ включает в себя сокет нашего процессора */
                        if (coolSocket && !coolSocket.includes(cpuSocket)) {
                            cpuButton.classList.add('disabled');
                            cpuButton.textContent = 'Не совместимо';
                            cpuCard.style.opacity = '0.4';
                        } else {
                            /* Если сокет процессора поддерживается кулером */
                            cpuButton.classList.remove('disabled');
                            cpuButton.textContent = 'Выбрать';
                            cpuCard.style.opacity = '1';
                        }
                    });
                }
            }

            /* Проверка процессора и материнской платы */
            if (partType === 'cpu') {
                const cpuSocket = button.getAttribute('data-socket');
                const motherBox = document.getElementById('step-motherboard');
                if (motherBox) {
                    const motherButtons = motherBox.querySelectorAll('.btn-select');
                    motherButtons.forEach(function(motherButton) {
                        const motherSocket = motherButton.getAttribute('data-socket');
                        const motherCard = motherButton.closest('.card');
                        if (motherSocket !== cpuSocket) {
                            motherButton.classList.add('disabled');
                            motherButton.textContent = 'Не совместимо';
                            motherCard.style.opacity = '0.4';
                        } else {
                            motherButton.classList.remove('disabled');
                            motherButton.textContent = 'Выбрать';
                            motherCard.style.opacity = '1';
                        }
                    });
                }
            }
            if (partType === 'motherboard') {
                const motherSocket = button.getAttribute('data-socket');
                const cpuBox = document.getElementById('step-cpu');
                if (cpuBox) {
                    const cpuButtons = cpuBox.querySelectorAll('.btn-select');
                    cpuButtons.forEach(function(cpuButton) {
                        const cpuSocket = cpuButton.getAttribute('data-socket');
                        const cpuCard = cpuButton.closest('.card');
                        if (cpuSocket !== motherSocket) {
                            cpuButton.classList.add('disabled');
                            cpuButton.textContent = 'Не совместимо';
                            cpuCard.style.opacity = '0.4';
                        } else {
                            cpuButton.classList.remove('disabled');
                            cpuButton.textContent = 'Выбрать';
                            cpuCard.style.opacity = '1';
                        }
                    });
                }
            }

            /* Проверка материнской платы и корпуса */
            if (partType === 'case') {
                const caseSize = button.getAttribute('data-size');
                const motherBox = document.getElementById('step-motherboard');
                if (motherBox) {
                    const motherButtons = motherBox.querySelectorAll('.btn-select');
                    motherButtons.forEach(function(moboButton) {
                        const motherSize = moboButton.getAttribute('data-size');
                        const motherCard = moboButton.closest('.card');
                        if (caseSize && !caseSize.includes(motherSize)) {
                            moboButton.classList.add('disabled');
                            moboButton.textContent = 'Не совместимо';
                            motherCard.style.opacity = '0.4';
                        } else {
                            moboButton.classList.remove('disabled');
                            moboButton.textContent = 'Выбрать';
                            motherCard.style.opacity = '1';
                        }
                    });
                }
            }
            if (partType === 'motherboard') {
                const motherSize = button.getAttribute('data-size');
                const caseBox = document.getElementById('step-case');
                if (caseBox) {
                    const caseButtons = caseBox.querySelectorAll('.btn-select');
                    caseButtons.forEach(function(caseButton) {
                        const caseSize = caseButton.getAttribute('data-size');
                        const caseCard = caseButton.closest('.card');
                        if (caseSize && !caseSize.includes(motherSize)) {
                            caseButton.classList.add('disabled');
                            caseButton.textContent = 'Не совместимо';
                            caseCard.style.opacity = '0.4';
                        } else {
                            caseButton.classList.remove('disabled');
                            caseButton.textContent = 'Выбрать';
                            caseCard.style.opacity = '1';
                        }
                    });
                }
            }

            /* Запускаем проверку готовности к создании */
            checkBuildReady();
        });
    });


    /* --- Финальный статус и переход на Summary.html --- */
    /* Находим нашу главную кнопку финала и индикатор по их ID */
    const btnForge = document.getElementById('btn-forge');
    const builderStatus = document.getElementById('builder-status');

    /* Создаем функцию, которая проверяет, готов ли компьютер к созданию */
    function checkBuildReady() {
        let chosenCount = 0;
        /* Считаем, сколько категорий заполнено ценой больше нуля */
        for (let key in selectedBuild) {
            if (selectedBuild[key].price > 0) {
                chosenCount++;
            }
        }
        /* Если выбраны ВСЕ 8 компонентов, активируем кнопку финала и иконку */
        if (chosenCount === 8) {
            btnForge.classList.remove('disabled');
            btnForge.classList.add('animate__animated', 'animate__pulse', 'animate__infinite');
            if (pcIcon) {
                pcIcon.classList.remove('text-muted');
                pcIcon.classList.add('text-warning');
                pcIcon.style.filter = 'drop-shadow(0 0 15px #ff7300)';
            }
        } else {
        /* А если не все компоненты выбраны, блокируем доступ к следующему сайту */
            btnForge.classList.add('disabled');
            btnForge.classList.remove('animate__animated', 'animate__pulse', 'animate__infinite');
            if (pcIcon) {
                pcIcon.classList.remove('text-warning');
                pcIcon.classList.add('text-muted');
                pcIcon.style.filter = 'none';
            }
        }
    }

    /* Настраиваем кнопку «ВЫКОВАТЬ ПК» */
    if (btnForge) {
        btnForge.addEventListener('click', function() {
            if (btnForge.classList.contains('disabled')) return;

            const anvil = new Audio('../audio/CyberForgeSound.mp3');
            anvil.play();

            let finalComponents = [];
            for (let key in selectedBuild) {
                const currentBox = document.getElementById('step-' + key);
                const activeButton = currentBox.querySelector('.btn-success');
                let partName = "Не выбрано";
                if (activeButton) {
                    partName = activeButton.getAttribute('data-name');
                }
                finalComponents.push({
                    type: key,
                    name: partName,
                    price: selectedBuild[key].price,
                    wattage: selectedBuild[key].wattage
                });
            }
            /* Если всё готово, сохраняем всю информацию о сборке в формате JSON, и отправляемся вместе с ним на Summary.html */
            localStorage.setItem('cyberBuild', JSON.stringify(finalComponents));
            setTimeout(function() {
                window.location.href = './Summary.html';
            }, 3500); 
        });
    }
});

/* --- СИСТЕМА СЛУЧАЙНЫХ КИБЕР-СОВЕТОВ --- */
    const adviceContainer = document.getElementById('advice-container');
    if (adviceContainer) {
        const tips = [
            "Совет Кузнеца: Используй наш конструктор вместе с Википедией, так гораздо удобнее...",
            "Совет Кузнеца: Ты вообще уверен, что у тебя компьютер получится собрать без кредита?",
            "Совет Кузнеца: Когда берёшь оперативку, бери две плашки вместо одной или четырёх. Прирост будет большой, не пожалеешь!",
            "Совет Кузнеца: Если не знаешь, как и что собирать, не мучайся. Лучше иди на консультацию к мастеру — соберёте ПК специально под тебя!",
            "Вся информация на нашем сайте о комплектующих может отличаться от реалии. Уточняйте в интернете или у сборщиков!",
            "Не все виды комплектующих можно у нас найти, наш сайт ещё на стадии разработки. Приносим извинения за доставленные неудобства..."
        ];
        const randomIndex = Math.floor(Math.random() * tips.length);
        const randomTip = tips[randomIndex];
        /* Создаем вывеску на экране */
        adviceContainer.innerHTML = `
            <div class="alert alert-dismissible p-5 mb-3 cyber-sign text-center" role="alert" id="cyber-alert">
                <div class="fs-4 fw-bold" style="font-family: 'Ruda', sans-serif;">
                    ${randomTip}
                </div>
                <button type="button" class="btn-close btn-close-white my-close" aria-label="Close" style="position: absolute; right: 10px; scale: 1.3;"></button>
            </div>
            `;
        /* Делаем функцию, которая закроет вывеску с советами и освободит место */
        setTimeout(function() {
            const closeBtnCustom = adviceContainer.querySelector('.my-close');
            const alertBlock = document.getElementById('cyber-alert');

            if (closeBtnCustom && alertBlock) {
                closeBtnCustom.addEventListener('click', function() {
                    /* Включаем плавный 3D-улет вывески */
                    alertBlock.classList.add('closing');
                    adviceContainer.classList.add('shrunk')
                    
                    /* Ждем 1.2 секунды, пока плашка полностью улетит, а каталог доедет до самого верха */
                    setTimeout(function() {
                        adviceContainer.innerHTML = '';
                    }, 1200);
                });
            }
        });
    }