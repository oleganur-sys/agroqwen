/* ЗемОтдел — Экспертный чат-бот (НПА АПК + Перехват лидов в CRM zemotdel.online) v20261021 */
(function () {
  const CRM_URL = 'https://zemotdel.online/api/lead.php';

  // Экспертная база знаний (Законы, Постановления, Риски КоАП, Решения)
  const KB_NODES = {
    start: {
      msg: 'Здравствуйте! Я дежурный онлайн-помощник <b>«ЗемОтдел»</b>.<br><br>Подскажу нормативы Минсельхоза, сроки отчётности, штрафы и стоимость решения вашей задачи. Выберите тему или напишите вопрос внизу:',
      opts: [
        { t: '🌾 Срочный вопрос по ГИС АПК', next: 'gis_menu' },
        { t: '📐 Земля, паи, аренда, кадастр', next: 'land_menu' },
        { t: '💰 Субсидии и гранты 2026–2027', next: 'sub_menu' },
        { t: '🛡 Скоро проверка / Пришло предписание', next: 'audit_menu' },
        { t: '📄 Документы и доступы (ЭЦП, МЧД)', next: 'docs_menu' }, // Новая кнопка
        { t: '🗺️ Нормативы по регионам', next: 'regions_menu' }, // Новая кнопка
        { t: '🤝 Я бухгалтер / Аутсорсинг', next: 'b2b_info' },
        { t: '🧮 Рассчитать стоимость сопровождения', next: 'calc_size' }
      ]
    },

    // --- ВЕТКА ГИС АПК ---
    gis_menu: {
      msg: 'По какой государственной системе нужна помощь?',
      opts: [
        { t: '🗺️ ЕФГИС ЗСН (поля, контуры, севооборот)', next: 'gis_zsn' },
        { t: '🌾 ФГИС «Зерно» (СДИЗ, партии, урожай)', next: 'gis_zerno' },
        { t: '🍃 ФГИС «Сатурн» (пестициды, СЗР, акты)', next: 'gis_saturn' },
        { t: '🌱 ФГИС «Семеноводство» (семена, апробация)', next: 'gis_semena' },
        { t: '📦 Все 4 системы под ключ', next: 'calc_size' }
      ]
    },
    gis_zsn: {
      msg: '<b>ЕФГИС ЗСН (ПП РФ от 02.02.2023 № 154, ФЗ от 24.07.2002 № 101-ФЗ):</b><br>• Сведения о контурах, севообороте и правах вносятся в течение <b>30 дней</b> после изменений (посевы — до 1 июля, урожай — до 1 декабря).<br>• <b>Риск:</b> штраф по ст. 8.8 КоАП РФ <b>100 000–200 000 ₽</b>. Без верифицированных полей в ЗСН система <b>не даст внести урожай в ФГИС «Зерно»</b> и заблокирует заявку на субсидии.<br><br>✅ <b>Как мы решаем:</b> сводим границы с Росреестром, готовим векторные контуры (SHP/KML) и проходим верификацию за вас. Разовая работа или ведение — <b>от 1 000 ₽</b>.',
      opts: [
        { t: '📞 Проверить наши поля в ЗСН (Бесплатно)', next: 'lead_capture', tag: 'ЕФГИС ЗСН: проверка полей' },
        { t: '◀ Другая система ГИС', next: 'gis_menu' }
      ]
    },
    gis_zerno: {
      msg: '<b>ФГИС «Зерно» (ПП РФ от 09.10.2021 № 1722, Закон РФ от 14.05.1993 № 4973-1):</b><br>• Данные о собранном урожае вносятся <b>не позднее 5 дней</b> после завершения уборки.<br>• СДИЗ оформляется <b>до выезда машины</b> или перехода права собственности.<br>• <b>Риск:</b> штраф по ст. 10.3 КоАП РФ до <b>10 000 ₽ (или приостановка деятельности)</b>, разворот зерновозов и отказ элеватора принять зерно.<br><br>✅ <b>Как мы решаем:</b> подключаемся по МЧД за 2 часа (без передачи вашей ЭЦП!), формируем партии, выпускаем и гасим СДИЗы — <b>от 1 000 ₽</b>.',
      opts: [
        { t: '📖 Пошаговая инструкция по СДИЗ', next: 'https://zemotdel.ru/blog/sdiz-fgis-zerno.html' },
        { t: '⚡ Срочно оформить СДИЗ / Урожай', next: 'lead_capture', tag: 'ФГИС Зерно: срочная помощь' },
        { t: '◀ Другая система ГИС', next: 'gis_menu' }
      ]
    },
    gis_saturn: {
      msg: '<b>ФГИС «Сатурн» (ПП РФ № 828, ФЗ № 109-ФЗ):</b><br>• Оповещение жителей и пасек — минимум <b>за 5 дней</b> до обработки.<br>• Приёмка накладных и акты применения СЗР по каждому полю — <b>от 1 до 3 рабочих дней</b>.<br>• <b>Риск:</b> ст. 8.3 КоАП РФ — штраф до <b>250 000 ₽</b> или приостановка работы хозяйства <b>до 90 суток</b>.<br><br>✅ <b>Как мы решаем:</b> вы присылаете фото накладных в мессенджер, а мы вносим планы и списываем СЗР строго по регламенту дозировок — <b>от 1 000 ₽/мес</b>.',
      opts: [
        { t: '🛡 Навести порядок в «Сатурне»', next: 'lead_capture', tag: 'ФГИС Сатурн: сопровождение' },
        { t: '◀ Другая система ГИС', next: 'gis_menu' }
      ]
    },
    gis_semena: {
      msg: '<b>ФГИС «Семеноводство» (ФЗ № 454-ФЗ, ПП РФ № 754):</b><br>• Обязательна при покупке, производстве и высеве семян. Списание на сев — <b>в течение 5 дней</b>, сделки — до 10 дней.<br>• <b>Риск:</b> если партия семян не проведена и не привязана к полю ЕФГИС ЗСН, Минсельхоз <b>отказывает в погектарной и элитной субсидии</b>.<br><br>✅ <b>Как мы решаем:</b> подгружаем акты апробации Россельхозцентра, оформляем партии и списание на сев — <b>от 1 000 ₽</b>.',
      opts: [
        { t: '🌱 Оформить семена без ошибок', next: 'lead_capture', tag: 'ФГИС Семеноводство' },
        { t: '◀ Другая система ГИС', next: 'gis_menu' }
      ]
    },

    // --- ВЕТКА ЗЕМЛИ ---
    land_menu: {
      msg: 'Земельные споры и ошибки в кадастре несут риск потери участков (ФЗ № 101-ФЗ, ПП РФ № 1482). Какая задача стоит перед вами?',
      opts: [
        { t: '📜 Выдел паёв / Долевая собственность', next: 'land_pai' },
        { t: '📝 Продление аренды / Сервитут', next: 'land_lease' },
        { t: '🔄 Перевод категории / Изменение ВРИ / Кадастр', next: 'land_vri' },
        { t: '🔨 Купить или арендовать землю на торгах', next: 'land_auction' }
      ]
    },
    land_pai: {
      msg: '<b>Работа с земельными долями (ФЗ № 101-ФЗ):</b><br>Невыделенные паи и «мёртвые души» грозят изъятием невостребованных долей муниципалитетом или перехватом земли конкурентами.<br><br>✅ <b>Наше решение:</b> проводим аудит правоустанавливающих документов (от 3 000 ₽), готовим проект межевания, протоколы собраний и сопровождаем выдел доли в собственность — <b>от 5 000 ₽</b>.',
      opts: [
        { t: '📖 Пошаговая инструкция по выделу доли', next: 'https://zemotdel.ru/blog/vydel-zemelnoy-doli.html' },
        { t: '📞 Разобрать ситуацию по нашим паям', next: 'lead_capture', tag: 'Земля: выдел паёв и долей' },
        { t: '◀ Назад к земельным вопросам', next: 'land_menu' }
      ]
    },
    land_lease: {
      msg: '<b>Договоры аренды с/х земель (ЗК РФ, ст. 10 ФЗ № 101-ФЗ):</b><br>Если пропустить срок подачи заявления на новый договор до окончания текущего или иметь предписание по ст. 8.8 КоАП, хозяйство <b>теряет преимущественное право</b> продления без торгов.<br><br>✅ <b>Наше решение:</b> проверяем чистоту участка в ЕФГИС ЗСН и Росреестре, готовим комплект документов на продление аренды или сервитут — <b>от 3 000 ₽</b>.',
      opts: [
        { t: '📞 Проверить договор аренды', next: 'lead_capture', tag: 'Земля: аренда и сервитут' },
        { t: '◀ Назад к земельным вопросам', next: 'land_menu' }
      ]
    },
    land_vri: {
      msg: '<b>Изменение ВРИ, категории и кадастровой стоимости:</b><br>Несоответствие ВРИ фактической деятельности — это штрафы до 1–2% от кадастровой стоимости и отказ в господдержке.<br><br>✅ <b>Наше решение:</b> оцениваем перспективы снижения кадастровой стоимости (от 3 000 ₽) и готовим документацию на смену ВРИ / перевод категории — <b>от 10 000 ₽</b>.',
      opts: [
        { t: '📞 Бесплатная оценка по кадастровому номеру', next: 'lead_capture', tag: 'Земля: ВРИ и кадастровая стоимость' },
        { t: '◀ Назад к земельным вопросам', next: 'land_menu' }
      ]
    },
    land_auction: {
      msg: '<b>Земельные аукционы и торги банкротов (ГИС Торги):</b><br>Через муниципальные торги и банкротства можно взять с/х землю и технику на 30–70% выгоднее рынка. Главный риск — скрытые обременения и чужие посевы.<br><br>✅ <b>Наше решение:</b> подбираем лоты, проверяем юридическую чистоту до внесения задатка и выигрываем торги под ключ.',
      opts: [
        { t: '🔨 Подобрать участки или проверить лот', next: 'lead_capture', tag: 'Аукционы по земле и активам' },
        { t: '◀ В главное меню', next: 'start' }
      ]
    },

    // --- СУБСИДИИ И ПРОВЕРКИ ---
    sub_menu: {
      msg: '<b>Субсидии, гранты и отчётность (ПП РФ № 717, № 1780):</b><br>В 2026–2027 гг. приём заявок в «Электронном бюджете» и АИС «Субсидии АПК» идёт с автоматической сверкой с ЕФГИС ЗСН, ФГИС «Зерно» и «Семеноводство». Расхождение даже в 1 га даёт автоматический отказ.<br><br>✅ <b>Наше решение:</b> бесплатно подберём доступные вашему хозяйству программы, выровняем данные в ГИС и соберём пакет документов (включая формы 1-КФХ, 6-АПК, 9-АПК) — <b>от 5 000 ₽</b>.',
      opts: [
        { t: '💰 Узнать, какие субсидии положены нам', next: 'lead_capture', tag: 'Субсидии АПК: подбор и документы' },
        { t: '◀ В главное меню', next: 'start' }
      ]
    },
    audit_menu: {
      msg: '<b>Подготовка к проверкам Россельхознадзора и прокуратуры:</b><br>Инспекторы сейчас выписывают предостережения и штрафы <b>дистанционно</b> — по космоснимкам ЕФГИС ЗСН и перекрёстной сверке объёмов урожая в «Зерне» и списаний в «Сатурне».<br><br>✅ <b>Наше решение:</b> проведём закрытый превентивный аудит ваших кабинетов (от 500 ₽), устраним расхождения до визита инспектора или подготовим юридический ответ на предписание.',
      opts: [
        { t: '🛡 Провести экспресс-аудит хозяйства (0 ₽)', next: 'lead_capture', tag: 'Аудит перед проверкой / Предписание' },
        { t: '◀ В главное меню', next: 'start' }
      ]
    },
    b2b_info: {
      msg: '<b>Партнёрство для бухгалтерских фирм:</b><br>Ваши бухгалтеры не должны тратить время на изучение контуров полей SHP/KML и норм списания пестицидов.<br><br>✅ <b>Модель работы:</b> мы заключаем агентский договор. Вы ведёте бухучёт и налоги, а мы закрываем все 4 ГИС АПК и земельные вопросы ваших клиентов (под вашим брендом или с выплатой вам агентской комиссии).',
      opts: [
        { t: '🤝 Получить партнёрский прайс для бухгалтерии', next: 'lead_capture', tag: 'Партнёрство для бухгалтерской фирмы' },
        { t: '◀ В главное меню', next: 'start' }
      ]
    },

    // --- КАЛЬКУЛЯТОР СТОИМОСТИ ---
    calc_size: {
      msg: 'Чтобы назвать точную цену без переплат, подскажите примерную площадь пашни (или количество систем):',
      opts: [
        { t: 'До 500 га (КФХ / 1–2 системы)', next: 'calc_res_small' },
        { t: 'От 500 до 3 000 га (Среднее хозяйство)', next: 'calc_res_mid' },
        { t: 'Свыше 3 000 га / Группа компаний', next: 'calc_res_big' },
        { t: 'Нужна только разовая услуга / консультация', next: 'calc_res_once' }
      ]
    },
    calc_res_small: {
      msg: '📊 <b>Расчёт для небольшого КФХ (до 500 га):</b><br>• Ведение одной системы (например, ЕФГИС ЗСН или Зерно) — <b>от 1 000 ₽/мес</b>.<br>• Все 4 системы под ключ с гарантией по договору — <b>от 5 000 ₽/мес</b>.<br><i>Это в 12–15 раз дешевле штатного специалиста и полностью списывается в расходы.</i>',
      opts: [
        { t: '✅ Зафиксировать цену и провести бесплатный аудит', next: 'lead_capture', tag: 'Расчёт тарифа: КФХ до 500 га' },
        { t: '◀ В начало', next: 'start' }
      ]
    },
    calc_res_mid: {
      msg: '📊 <b>Расчёт для хозяйства 500 – 3 000 га (Тариф «Комплекс АПК»):</b><br>• Полное ведение всех 4 обязательных систем (ЕФГИС ЗСН, Зерно, Сатурн, Семеноводство) — <b>от 5 000 ₽/мес</b>.<br>• Включено: внесение данных день в день в уборочную, выпуск СДИЗ, акты СЗР и финансовая ответственность за сроки.',
      opts: [
        { t: '✅ Получить точное КП под наши площади', next: 'lead_capture', tag: 'Расчёт тарифа: Комплекс АПК (500-3000 га)' },
        { t: '◀ В начало', next: 'start' }
      ]
    },
    calc_res_big: {
      msg: '📊 <b>Для хозяйств от 3 000 га и агрохолдингов:</b><br>• Индивидуальное сопровождение: все 4 ГИС + АИС «Субсидии», ЕЦП АПК, ревизия договоров аренды и паёв, защита при проверках.<br>• Подключаем выделенного профильного аналитика по МЧД.',
      opts: [
        { t: '📞 Заказать расчёт и аудит у руководителя отдела', next: 'lead_capture', tag: 'Расчёт тарифа: АгроХолдинг 3000+ га' },
        { t: '◀ В начало', next: 'start' }
      ]
    },
    calc_res_once: {
      msg: '📊 <b>Разовые услуги (без абонентской платы):</b><br>• Консультация эксперта (до 15 мин) или экспресс-проверка — <b>от 500 ₽</b><br>• Разовое внесение отчёта / закрытие СДИЗ / контур в ЗСН — <b>от 1 000 ₽</b><br>• Проверка документов на землю / аренда — <b>от 3 000 ₽</b>',
      opts: [
        { t: '✅ Оставить заявку на разовую задачу', next: 'lead_capture', tag: 'Запрос на разовую услугу' },
        { t: '◀ В начало', next: 'start' }
      ]
    },

        // --- НОВАЯ ВЕТКА: ДОКУМЕНТЫ И ДОСТУПЫ ---
    docs_menu: {
      msg: '📄 <b>Документы и доступы для работы в ГИС АПК</b><br><br>Чтобы мы или ваши сотрудники могли работать в государственных системах, нужны два ключевых элемента: электронная подпись (ЭЦП) и машиночитаемая доверенность (МЧД).',
      opts: [
        { t: '🔑 Что такое ЭЦП и как её получить?', next: 'docs_ecp' },
        { t: '📜 Что такое МЧД и как её оформить?', next: 'docs_mchd' },
        { t: '◀ Назад в главное меню', next: 'start' }
      ]
    },
    docs_ecp: {
      msg: '<b>🔑 Электронная подпись (ЭЦП)</b><br><br>Это ваш цифровой «ключ» для подписания документов в государственных системах. Без неё работа в ГИС АПК невозможна.<br><br><b>Как получить (кратко):</b><br>1. Обратиться в аккредитованный удостоверяющий центр (например, «Тензор», «СКБ Контур» или др.).<br>2. Выбрать тип подписи — для руководителей и ИП подходит квалифицированная (УКЭП).<br>3. Предоставить документы (паспорт, СНИЛС, ИНН, выписка из ЕГРЮЛ/ЕГРИП).<br>4. Получить сертификат и токен (физический носитель).<br><br><b>⚠️ Важно с 2026 года:</b> необходимо обновить «КриптоПро CSP» до версии 5.0 R2 или выше и, возможно, заменить сам токен (если используется устаревший Рутокен ЭЦП 2.0), так как ФНС перешла на новые стандарты шифрования.',
      opts: [
        { t: '📖 Решение ошибки "Нет валидных сертификатов"', next: 'https://zemotdel.ru/blog/fgis-zerno-sertifikaty-ecp.html' },
        { t: '📞 Помочь с получением ЭЦП', next: 'lead_capture', tag: 'Помощь с получением ЭЦП' },
        { t: '📜 Перейти к МЧД', next: 'docs_mchd' },
        { t: '◀ Назад к документам', next: 'docs_menu' }
      ]
    },

    // --- НОВАЯ ВЕТКА: НОРМАТИВЫ ПО РЕГИОНАМ ---
    regions_menu: {
      msg: '🗺️ <b>Нормативы и требования по регионам</b><br><br>Требования к внесению данных в ЕФГИС ЗСН и условия получения субсидий могут различаться в зависимости от региона. Выберите вашу область, чтобы получить актуальную информацию:',
      opts: [
        { t: 'Волгоградская область', next: 'region_vgg' },
        { t: 'Новосибирская область', next: 'region_nso' },
        { t: 'Краснодарский край', next: 'region_krd' },
        { t: 'Другой регион / Уточнить', next: 'lead_capture', tag: 'Запрос нормативов по региону' },
        { t: '◀ Назад в главное меню', next: 'start' }
      ]
    },
    region_vgg: {
      msg: '<b>📍 Волгоградская область</b><br><br>Ключевое требование для получения субсидий — наличие актуальных сведений о земельных участках в ЕФГИС ЗСН (Реестре ЗСН).[reference:5] С 2026 года мораторий на предоставление этих сведений отменён, и отсутствие данных является основанием для отказа.<br><br>Также рекомендуется отслеживать локальные приказы комитета сельского хозяйства области.',
      opts: [
        { t: '📞 Проверить наши поля в ЗСН (бесплатно)', next: 'lead_capture', tag: 'Волгоград: проверка полей ЗСН' },
        { t: '🗺️ Выбрать другой регион', next: 'regions_menu' }
      ]
    },
    region_nso: {
      msg: '<b>📍 Новосибирская область</b><br><br>С 1 января 2026 года отменён мораторий на предоставление сведений из ЕФГИС ЗСН для получения субсидий. Правила ведения Реестра ЗСН утверждены Постановлением Правительства РФ № 154 от 02.02.2023.<br><br>Обязательно проверьте наличие и корректность всех записей о ваших земельных участках в реестре.[reference:6]',
      opts: [
        { t: '📞 Проверить наши поля в ЗСН (бесплатно)', next: 'lead_capture', tag: 'Новосибирск: проверка полей ЗСН' },
        { t: '🗺️ Выбрать другой регион', next: 'regions_menu' }
      ]
    },
    region_krd: {
      msg: '<b>📍 Краснодарский край</b><br><br>В регионе действует активная поддержка сельхозпроизводителей. Для получения субсидий обязательна регистрация в ЕФГИС ЗСН.<br><br>Рекомендуем дополнительно ознакомиться с приказами Министерства сельского хозяйства и перерабатывающей промышленности Краснодарского края.',
      opts: [
        { t: '📞 Проверить наши поля в ЗСН (бесплатно)', next: 'lead_capture', tag: 'Краснодар: проверка полей ЗСН' },
        { t: '🗺️ Выбрать другой регион', next: 'regions_menu' }
      ]
    }
  };

  // Умный распознаватель свободного текста клиента по ключевым словам
  function matchFreeText(text) {
    const q = text.toLowerCase();
    if (/сдиз|зерн|элеватор|урож|пшениц|ячмен|подсолнеч|парти/.test(q)) return 'gis_zerno';
    if (/зсн|ефгис|контур|пол[еяй]|карт|севооборот|shp|kml|наложен/.test(q)) return 'gis_zsn';
    if (/сатурн|пестицид|сзр|гербицид|обработ|пасек|опрыск|акт/.test(q)) return 'gis_saturn';
    if (/семен|апробац|россельхозцентр|высев|сорт/.test(q)) return 'gis_semena';
    if (/пай|паи|доле|доля|выдел|межев|собствен/.test(q)) return 'land_pai';
    if (/аренд|сервитут|продл|договор/.test(q)) return 'land_lease';
    if (/ври|категор|кадастр|налог|стоимост/.test(q)) return 'land_vri';
    if (/торг|аукцион|банкрот|лот|купить зем/.test(q)) return 'land_auction';
    if (/субсид|грант|господдерж|6-апк|1-кфх|9-апк|бюджет/.test(q)) return 'sub_menu';
    if (/проверк|штраф|предписан|прокурат|надзор|коап/.test(q)) return 'audit_menu';
    if (/бухгалт|аутсорс|агент|партнер|мчд|эцп/.test(q)) return 'b2b_info';
    if (/цен|скольк|стоим|тариф|прайс/.test(q)) return 'calc_size';
    if (/эцп|электронн[а-я]* подпис|криптопро|рутокен|токен/.test(q)) return 'docs_ecp';
    if (/мчд|машиночитаем[а-я]* доверенност|доверенность|госключ|полномочия/.test(q)) return 'docs_mchd';
    if (/регион|област|край|норматив|требовани.*регион/.test(q)) return 'regions_menu';
    return null;
  }

  let chatHistory = [];
  let selectedTopic = 'Консультация из чат-бота';

  function injectStyles() {
    if (document.getElementById('zq-bot-styles')) return;
    const st = document.createElement('style');
    st.id = 'zq-bot-styles';
    st.textContent = `
      .zq-fab-wrap { position:fixed; right:22px; bottom:22px; z-index:9998; display:flex; align-items: center; background:#0f3b2e; border-radius:999px; padding: 6px 6px 6px 18px; box-shadow: 0 8px 24px rgba(15,59,46,.28); border: 1px solid rgba(255,255,255,.15); gap: 10px; transition: bottom 0.3s ease, padding 0.3s ease, background 0.3s ease; }
      .zq-fab-sep { width: 1px; height: 26px; background: rgba(255,255,255,.2); flex-shrink: 0; display: block; }
      
      body.zq-banner-open .zq-fab-wrap { bottom: 96px !important; padding: 0 !important; background: transparent !important; border: none !important; box-shadow: none !important; gap: 0 !important; }
      body.zq-banner-open .zq-fab-label, body.zq-banner-open .zq-fab-sep { display: none !important; }
      .zq-fab-label { background:transparent; color:#fff; font-size:13.5px; font-weight:700; padding:0; border:none; box-shadow:none; cursor:pointer; display:flex; align-items:center; gap:8px; transition:color .2s, transform .15s; font-family:inherit; }
      .zq-fab-label:hover { color: #f4a118; }
      .zq-fab-label:active { transform: scale(0.97); }
      
      .zq-fab { position:relative !important; width:46px; height:46px; flex-shrink:0; top:auto !important; bottom:auto !important; left:auto !important; right:auto !important; margin:0 !important; transition: transform .2s; }
      .zq-fab:hover { transform: scale(1.08); }
      .zq-fab-dot { width:8px; height:8px; background:#22c55e; border-radius:50%; box-shadow:0 0 0 3px rgba(34,197,94,.3); }

      .zbot-win { position:fixed; right:22px; bottom:92px; width:400px; max-width:calc(100vw - 24px); height:580px; max-height:calc(100vh - 120px); background:#fff; border-radius:20px; box-shadow:0 24px 64px rgba(9,34,26,.28); border:1px solid #d5ddd8; z-index:9999; display:flex; flex-direction:column; overflow:hidden; font-family:'Inter',sans-serif; }
      .zbot-win[hidden] { display:none !important; }
      .zbot-head { background:linear-gradient(135deg,#0f3b2e 0%,#185442 100%); color:#fff; padding:14px 18px; display:flex; align-items:center; justify-content:space-between; gap:10px; }
      .zbot-head-info { display:flex; align-items:center; gap:10px; }
      .zbot-ava { width:38px; height:38px; border-radius:10px; background:#fff; padding:2px; object-fit:contain; }
      .zbot-head-title { font-weight:800; font-size:14.5px; line-height:1.2; }
      .zbot-head-sub { font-size:11.5px; color:#b2d4c5; display:flex; align-items:center; gap:5px; margin-top:2px; }
      .zbot-close { background:rgba(255,255,255,.12); border:0; color:#fff; width:32px; height:32px; border-radius:50%; cursor:pointer; font-size:16px; display:flex; align-items:center; justify-content:center; }
      .zbot-close:hover { background:rgba(255,255,255,.24); }

      .zbot-msgs-bar { background:#f3f7f4; border-bottom:1px solid #e2e6e1; padding:8px 14px; display:flex; align-items:center; justify-content:space-between; gap:8px; font-size:12px; color:#4b5952; }
      .zbot-msgs-links { display:flex; gap:6px; align-items:center; }
      .zbot-msgs-links a { font-size:11.5px; font-weight:700; padding:4px 9px; border-radius:6px; text-decoration:none; color:#fff; }
      .zbot-wa { background:#25D366; }
      .zbot-tg { background:#2AABEE; }
      .zbot-max { background:#9333EA; }

      .zbot-body { flex:1; padding:16px; overflow-y:auto; background:#f8faf8; display:flex; flex-direction:column; gap:12px; }
      .zbot-bubble { max-width:92%; padding:12px 14px; border-radius:14px; font-size:13.5px; line-height:1.5; word-wrap:break-word; }
      .zbot-bubble.bot { background:#fff; border:1px solid #e2e6e1; color:#131c18; align-self:flex-start; border-bottom-left-radius:4px; box-shadow:0 2px 6px rgba(0,0,0,.03); }
      .zbot-bubble.user { background:#0f3b2e; color:#fff; align-self:flex-end; border-bottom-right-radius:4px; }
      .zbot-opts { display:flex; flex-direction:column; gap:7px; margin-top:4px; }
      .zbot-opt-btn { text-align:left; background:#fff; border:1px solid #c5d3cc; color:#0f3b2e; padding:9px 13px; border-radius:10px; font-size:13px; font-weight:600; cursor:pointer; transition:all .15s; font-family:inherit; }
      .zbot-opt-btn:hover { background:#0f3b2e; color:#fff; border-color:#0f3b2e; }

      .zbot-lead-box { background:#fff; border:1.5px solid #0f3b2e; border-radius:14px; padding:14px; display:flex; flex-direction:column; gap:9px; margin-top:4px; }
      .zbot-lead-box input { width:100%; padding:10px 12px; border:1px solid #cfd6d1; border-radius:8px; font-size:13.5px; font-family:inherit; }
      .zbot-lead-submit { background:#f4a118; color:#171204; border:0; border-radius:8px; padding:11px; font-weight:700; font-size:13.5px; cursor:pointer; font-family:inherit; }
      .zbot-lead-submit:hover { background:#dd8b08; }

      .zbot-foot { padding:10px 12px; background:#fff; border-top:1px solid #e2e6e1; display:flex; gap:8px; }
      .zbot-input { flex:1; border:1px solid #cfd6d1; border-radius:9px; padding:9px 12px; font-size:13.5px; font-family:inherit; outline:none; }
      .zbot-input:focus { border-color:#0f3b2e; }
      .zbot-send { background:#0f3b2e; color:#fff; border:0; border-radius:9px; padding:0 14px; font-weight:700; cursor:pointer; font-size:15px; }

      .zbot-mobile-fab { display: none; }
      @media(max-width:640px) {
        .zq-fab-wrap { display:none !important; }
        .zbot-win { right:8px; left:8px; bottom:90px; width:auto; max-width:none; height:76vh; max-height:540px; }
        .zbot-mobile-fab {
          display: flex !important;
          position: fixed;
          right: 14px;
          bottom: 92px;
          height: 48px;
          border-radius: 999px;
          background: linear-gradient(135deg,#0f3b2e,#185442);
          color: #fff;
          align-items: center;
          justify-content: center;
          font-size: 13.5px;
          font-weight: 700;
          padding: 0 16px 0 12px;
          box-shadow: 0 8px 24px rgba(15,59,46,.45);
          z-index: 9989;
          cursor: pointer;
          border: 0;
          gap: 6px;
        }
        body.zq-banner-open .zbot-mobile-fab { bottom: 200px !important; }
        .zbot-mobile-fab::after {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 12px;
          height: 12px;
          background: #22c55e;
          border-radius: 50%;
          box-shadow: 0 0 0 2px #fff;
        }
      }
    `;
    document.head.appendChild(st);
  }

  function buildWidget() {
    injectStyles();

    // Оборачиваем существующий FAB в заметную плашку с текстом
    const oldFab = document.querySelector('.zq-fab');
    if (oldFab && !oldFab.parentElement.classList.contains('zq-fab-wrap')) {
      const wrap = document.createElement('div');
      wrap.className = 'zq-fab-wrap';
      
      // Текст делаем кнопкой <button> для правильной работы с клавиатуры
      wrap.innerHTML = `<button type="button" class="zq-fab-label" id="zbot-trigger-lbl"><span class="zq-fab-dot"></span><span>Онлайн-эксперт</span></button><span class="zq-fab-sep" aria-hidden="true"></span>`;
      
      oldFab.parentNode.insertBefore(wrap, oldFab);
      wrap.appendChild(oldFab);
      
      // Добавляем подсказку на кнопку мессенджеров
      oldFab.setAttribute('title', 'Написать в мессенджер');
      oldFab.setAttribute('aria-label', 'Написать в мессенджер');
    }

    // В мобильную панель добавляем кнопку открытия бота, если кликают или хотят спросить
    const win = document.createElement('div');
    win.className = 'zbot-win';
    win.id = 'zbot-win';
    win.hidden = true;
    win.innerHTML = `
      <div class="zbot-head">
        <div class="zbot-head-info">
          <img src="img/logo-square.png" alt="ЗемОтдел" class="zbot-ava">
          <div>
            <div class="zbot-head-title">Дежурный эксперт ЗемОтдел</div>
            <div class="zbot-head-sub"><span class="zq-fab-dot"></span> ФГИС АПК · Земля · Субсидии</div>
          </div>
        </div>
        <button type="button" class="zbot-close" id="zbot-close" aria-label="Закрыть">✕</button>
      </div>
      <div class="zbot-msgs-bar">
        <span>Прямая связь:</span>
        <div class="zbot-msgs-links">
          <a href="https://wa.me/79297856151" target="_blank" rel="noopener" class="zbot-wa">WhatsApp</a>
          <a href="https://t.me/zemotdelGIS" target="_blank" rel="noopener" class="zbot-tg">Telegram</a>
          <a href="https://max.ru/u/f9LHodD0cOJUGcz1AaXKIjwi_hHs1mCC1F7y1FuzWHbFwTcm6F1E0k5Mktw" target="_blank" rel="noopener" class="zbot-max">МАКС</a>
        </div>
      </div>
      <div class="zbot-body" id="zbot-body"></div>
      <form class="zbot-foot" id="zbot-form">
        <input type="text" class="zbot-input" id="zbot-input" placeholder="Напишите ваш вопрос (например: СДИЗ, паи, ЗСН)..." autocomplete="off">
        <button type="submit" class="zbot-send" aria-label="Отправить">→</button>
      </form>
    `;
    document.body.appendChild(win);


    // Мобильная плавающая кнопка бота (видна только на ≤640px)
    var mobileFab = document.createElement('button');
    mobileFab.type = 'button';
    mobileFab.className = 'zbot-mobile-fab';
    mobileFab.setAttribute('aria-label', 'Открыть онлайн-эксперта');
    mobileFab.innerHTML = '<span>💬</span> Онлайн-эксперт';
    document.body.appendChild(mobileFab);
    mobileFab.addEventListener('click', function (e) { openBot(e); });


    const bodyEl = document.getElementById('zbot-body');

    function addBotMessage(html, opts, isUserAction = false) {
      const msgDiv = document.createElement('div');
      msgDiv.className = 'zbot-bubble bot';
      msgDiv.innerHTML = html;
      bodyEl.appendChild(msgDiv);

      if (opts && opts.length) {
        const optsWrap = document.createElement('div');
        optsWrap.className = 'zbot-opts';
        opts.forEach(o => {
          const b = document.createElement('button');
          b.type = 'button';
          b.className = 'zbot-opt-btn';
          b.textContent = o.t;
          b.addEventListener('click', () => {
            optsWrap.remove();
            addUserMessage(o.t);
            if (o.tag) selectedTopic = o.tag;
            
            if (o.next && o.next.startsWith('http')) {
                window.open(o.next, '_blank');
            } 
            else if (o.next === 'lead_capture') renderLeadForm();
            else goNode(o.next, true); // <--- Передаем true, т.к. это клик пользователя
          });
          optsWrap.appendChild(b);
        });
        bodyEl.appendChild(optsWrap);
      }
      
      // Прокручиваем вниз только если это ответ на действие пользователя
      if (isUserAction) {
        bodyEl.scrollTop = bodyEl.scrollHeight;
      }
    }

    function addUserMessage(text) {
      chatHistory.push(text);
      const uDiv = document.createElement('div');
      uDiv.className = 'zbot-bubble user';
      uDiv.textContent = text;
      bodyEl.appendChild(uDiv);
      bodyEl.scrollTop = bodyEl.scrollHeight;
    }

    function goNode(nodeId, isUserAction = false) {
      const node = KB_NODES[nodeId] || KB_NODES.start;
      
      let currentOpts = node.opts ? [...node.opts] : [];
      if (nodeId !== 'start' && !currentOpts.some(o => o.next === 'start')) {
        currentOpts.push({ t: '◀ В главное меню', next: 'start' });
      }

      setTimeout(() => addBotMessage(node.msg, currentOpts, isUserAction), 220);
    }

    function renderLeadForm(customNote) {
      const box = document.createElement('div');
      box.className = 'zbot-lead-box';
      box.innerHTML = `
        <div style="font-size:13px;font-weight:700;color:#0f3b2e">Оставьте телефон — профильный специалист бесплатно проверит ситуацию и назовёт точную стоимость:</div>
        <input type="text" id="zb-name" placeholder="Ваше имя *" required>
        <input type="tel" id="zb-phone" placeholder="+7 (___) ___-__-__ *" required>
        <input type="text" id="zb-org" placeholder="Хозяйство / ИНН или комментарий (необязательно)">
        <label style="font-size:11px;color:#56635c;display:flex;gap:6px;align-items:center">
          <input type="checkbox" id="zb-agree" checked style="width:auto">
          <span>Согласен с <a href="policy.html" target="_blank" style="color:#0f3b2e">политикой ПДн</a></span>
        </label>
        <button type="button" class="zbot-lead-submit" id="zb-submit">Получить консультацию эксперта →</button>
      `;
      bodyEl.appendChild(box);
      bodyEl.scrollTop = bodyEl.scrollHeight;

      box.querySelector('#zb-submit').addEventListener('click', async () => {
        const name = box.querySelector('#zb-name').value.trim();
        const phone = box.querySelector('#zb-phone').value.trim();
        const org = box.querySelector('#zb-org').value.trim();
        const agree = box.querySelector('#zb-agree').checked;

        if (!name || phone.replace(/\D/g, '').length < 10) {
          alert('Пожалуйста, укажите имя и корректный номер телефона.');
          return;
        }
        if (!agree) {
          alert('Отметьте согласие на обработку персональных данных.');
          return;
        }

        const btn = box.querySelector('#zb-submit');
        btn.disabled = true;
        btn.textContent = 'Передаём специалисту...';

        try {
          const res = await fetch(CRM_URL, {
            method: 'POST',
            mode: 'cors',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({
              name: name,
              phone: phone,
              org: org,
              who: 'Обращение из экспертного чат-бота',
              interest: selectedTopic,
              message: '[Чат-бот] Путь диалога: ' + chatHistory.join(' -> ') + (customNote ? ' | Вопрос: ' + customNote : ''),
              source: location.href
            })
          });
          const data = await res.json().catch(function(){ return {}; });
          if (!res.ok || !data.success) {
            throw new Error(data.error || 'Сервер не подтвердил приём заявки');
          }
          box.innerHTML = `<div style="color:#0f3b2e;font-weight:700;font-size:13.5px;text-align:center;padding:8px 0">✓ Заявка принята в работу!<br><span style="font-weight:400;font-size:12.5px;color:#4b5952">Специалист ЗемОтдел свяжется с вами в ближайшее время.</span></div>`;
        } catch (e) {
          btn.disabled = false;
          btn.textContent = 'Попробовать снова';
          alert('Не удалось отправить заявку: ' + e.message + '. Попробуйте ещё раз или позвоните +7 929 785 61 51.');
        }
      });
    }

    // Обработка свободного текстового вопроса от клиента
    document.getElementById('zbot-form').addEventListener('submit', (e) => {
      e.preventDefault();
      const inp = document.getElementById('zbot-input');
      const val = inp.value.trim();
      if (!val) return;
      inp.value = '';
      addUserMessage(val);

      const matched = matchFreeText(val);
      if (matched) {
        selectedTopic = 'Вопрос в чате: ' + val;
        goNode(matched, true); // <--- добавили true, так как это действие пользователя
      } else {
        selectedTopic = 'Нестандартный вопрос: ' + val;
        setTimeout(() => {
          addBotMessage('Зафиксировал ваш вопрос: <b>«' + val.replace(/</g, '&lt;') + '»</b>.<br><br>Задача требует сверки с нормативной базой и документами хозяйства. Оставьте контакт — наш профильный специалист разберёт её вручную и перезвонит (это бесплатно):');
          renderLeadForm(val);
        }, 250);
      }
    });

    function openBot(e) {
      if (e) { e.preventDefault(); e.stopPropagation(); }
      win.hidden = false;
      if (!bodyEl.children.length) {
        // Определяем, на какой странице мы находимся
        var path = window.location.pathname;
        var startNode = 'start';

        if (path.indexOf('soprovozhdenie-fgis-saturn') !== -1) startNode = 'gis_saturn';
        else if (path.indexOf('soprovozhdenie-fgis-zerno') !== -1) startNode = 'gis_zerno';
        else if (path.indexOf('soprovozhdenie-fgis-semena') !== -1) startNode = 'gis_semena';
        else if (path.indexOf('soprovozhdenie-efgis-zsn') !== -1) startNode = 'gis_zsn';
        else if (path.indexOf('zemelnye-voprosy') !== -1) startNode = 'land_menu';
        else if (path.indexOf('podgotovka-k-proverkam') !== -1) startNode = 'audit_menu';

        // Если это контекстная страница, бот сначала здоровается, а потом сразу выдает тему
        if (startNode !== 'start') {
            var topicText = KB_NODES[startNode].msg;
            // Ищем жирный текст для заголовка
            var bMatch = topicText.match(/<b>(.*?)<\/b>/);
            if (bMatch && bMatch[1]) {
                topicText = bMatch[1];
            } else {
                // Если жирного текста нет, берем только первое предложение (до точки или вопроса)
                topicText = topicText.split(/[.?]/)[0];
            }
            
            addBotMessage('Здравствуйте! Вижу, вас интересует: <b>' + topicText + '</b>. Вот что важно знать:', [], false);
            setTimeout(() => goNode(startNode, false), 800);
        } else {
            goNode('start', false);
        }
      }
    }

    function closeBot() { win.hidden = true; }

    const lbl = document.getElementById('zbot-trigger-lbl');
    if (lbl) lbl.addEventListener('click', openBot);
    // Сам .zq-fab больше не открывает бота — он открывает модалку мессенджеров (см. messengers.js).
    // Бот доступен только через плашку "Онлайн-эксперт ГИС и Земля".
    document.getElementById('zbot-close').addEventListener('click', closeBot);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', buildWidget);
  else buildWidget();
})();