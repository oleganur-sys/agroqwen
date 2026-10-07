const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbxqqQDf9RGzeIVYcGDQciitvmC-_pPcRhGON_W5mtfApmL4yr-j4983oq-7qR8sHsp_WA/exec';

// ===== БАЗА ЗНАНИЙ: ГИС (стартовая, сверить с экспертом) =====
const SYS = {
  zerno:   { n:'ФГИС «Зерно»',        d:'партии, качество, хранение и перемещение зерна', dl:'регистрация партии — в течение 3 дней после сбора', f:'50 000–100 000 ₽ для юрлица', law:'ст. 10.12 КоАП РФ', price:'ведение от 15 000 ₽/мес, аудит и настройка от 15 000 ₽' },
  zsn:     { n:'ЕФГИС ЗСН',           d:'карта сельхозземель: посевы, урожай, использование', dl:'посевы — до 1 июля; урожай — до 1 декабря', f:'100 000–200 000 ₽ для юрлица', law:'ст. 8.8 КоАП РФ', price:'ведение от 15 000 ₽/мес, аудит и настройка от 15 000 ₽' },
  saturn:  { n:'ФГИС «Сатурн»',       d:'учёт пестицидов и агрохимикатов', dl:'в течение суток после каждой обработки', f:'100 000–250 000 ₽ для юрлица', law:'ст. 8.3 КоАП РФ', price:'ведение от 15 000 ₽/мес, аудит и настройка от 15 000 ₽' },
  semena:  { n:'ФГИС «Семеноводство»',d:'учёт партий семян от производства до реализации', dl:'до реализации каждой партии', f:'20 000–50 000 ₽ для юрлица', law:'ст. 10.12 КоАП РФ', price:'ведение от 15 000 ₽/мес, аудит и настройка от 15 000 ₽' },
  subsidii:{ n:'АИС «Субсидии АПК»',  d:'заявки и отчётность по господдержке', dl:'окна приёма заявок — по календарю региона', f:'отказ в субсидии без корректных ГИС', law:'регламенты Минсельхоза', price:'от 25 000 ₽ или 5–10% от привлечённой суммы' },
  ecp:     { n:'ЕЦП АПК',             d:'«одно окно» и личный кабинет товаропроизводителя', dl:'часть данных подгружается автоматически', f:'—', law:'—', price:'—' }
};

const KB = {
  landRisks: {
    'Собственность':'Проверьте соответствие вида разрешённого использования (ВРИ) фактическому использованию: несоответствие — штрафы и отказ в субсидиях.',
    'Аренда':'Пропуск срока перезаключения аренды означает потерю приоритетного права. Готовить документы нужно заранее.',
    'Паи (долевая собственность)':'Невыделенные паи — споры с другими собственниками и риск утраты прав. Оформление: выдел доли, регистрация — 4–8 недель.',
    'Смешанная':'Часть задач по каждому статусу. Начнём с аудита: что оформлено, что нет, где риски.',
    'Не оформлены':'Использование земли без документов — штрафы по ст. 8.8 КоАП РФ и риск изъятия участка.'
  },
  landPrices:'Ориентиры: оформление паёв от 15 000 ₽, изменение ВРИ от 30 000 ₽, консультация от 3 000 ₽.',
  auctionNote:'На торгах банкротов и залоговых аукционах земля, недвижимость и техника уходят за 30–70% от рынка. Главный риск — обременения и дефекты документов: лот проверяется до подачи заявки.',
  auctionSteps:['Мониторинг торгов под ваши критерии','Проверка документов лота и подача заявки','Участие и сопровождение до подписания договора'],
  auctionPrice:'Ориентир: от 30 000 ₽ за проект.',
  subRefused:'Отказ в субсидии чаще всего происходит из-за ошибок в данных ГИС или неполного комплекта документов. Это устранимо: находим причину и подаём заявку повторно.',
  subNone:'Большинство хозяйств одновременно подходят под 2–4 программы поддержки: погектарная, техника, льготные кредиты. Подбор — бесплатно при диагностике.',
  subDeadline:'Важно: заявки принимаются только при корректных данных в ЕФГИС ЗСН и профильных ГИС.',
  subPrice:'Ориентир: от 25 000 ₽ или 5–10% от привлечённой суммы.',
  auditPlanned:'Проверка назначена — это лучший сценарий: есть время устранить нарушения до визита. После акта — дороже и часто невозможно.',
  auditPast:'Прошлые штрафы и предписания означают системный пробел. Проверим, сняты ли они, и исключим повторные санкции (двойные штрафы).',
  auditNone:'Даже без назначенной проверки аудит полезен: прокуратура и Россельхознадзор приходят «внезапно». Подготовка сводит штрафы к нулю.',
  auditPrice:'Ориентир: от 20 000 ₽ разово.',
  b2bOffer:'ГИС-направление под вашей маркой: берём агро-клиентов на себя по ГИС, земле и субсидиям. Агентская цена от 8 000 ₽/мес за клиента, регламенты и обучение сотрудников включены.'
};

const Q_FARM = { id:'farmType', t:'Кто вы?', hint:'От этого зависит набор направлений', multi:false,
  opts:['Агропредприятие / СПК','КФХ / фермер','Собственник / пайщик','Бухгалтерская фирма','Другое'] };

const Q_TRACKS = { id:'tracks', t:'Что диагностируем?', hint:'Выберите одно или несколько направлений — отчёт соберём по каждому', multi:true,
  opts:['ГИС и отчётность','Земля и документы','Аукционы и покупка активов','Субсидии и гранты','Подготовка к проверкам','Партнёрство для бухгалтерских фирм','Нестандартная ситуация'] };

const TRACK_QUESTIONS = {
  'ГИС и отчётность': [
    { id:'activities', t:'Чем занимается хозяйство?', hint:'Выберите все подходящие варианты', multi:true, opts:['Выращиваем зерно','Производим / продаём семена','Применяем пестициды и агрохимикаты','Только начинаем / не знаю'] },
    { id:'gisNow', t:'Сколько систем уже ведёте?', multi:false, opts:['Не ведём','1–2','3–4','5+'] },
    { id:'gisFines', t:'Были ли штрафы или отказы из-за ГИС за последний год?', multi:false, opts:['Да','Нет','Не знаю'] }
  ],
  'Земля и документы': [
    { id:'landStatus', t:'Какая у вас ситуация с землёй?', multi:false, opts:['Собственность','Аренда','Паи (долевая собственность)','Смешанная','Не оформлены'] },
    { id:'landNeed', t:'Что нужно по земле?', multi:true, opts:['Оформление в собственность','Изменение ВРИ / категории','Перезаключение аренды','Работа с пайщиками','Подбор участков','Консультация'] }
  ],
  'Аукционы и покупка активов': [
    { id:'auctionTarget', t:'Что хотите купить на торгах?', multi:false, opts:['Землю','Недвижимость','Технику и активы','Ещё не решил'] },
    { id:'auctionExp', t:'Участвовали уже в торгах?', multi:false, opts:['Участвовал и выигрывал','Участвовал, но не выиграл','Не участвовал'] }
  ],
  'Субсидии и гранты': [
    { id:'subExp', t:'Получали уже субсидии?', multi:false, opts:['Да, получаем','Были отказы','Не подавали'] },
    { id:'subType', t:'Какие программы интересуют?', multi:true, opts:['Погектарная','На технику и оборудование','Льготные кредиты','Не знаю, какие нам положены'] }
  ],
  'Подготовка к проверкам': [
    { id:'inspStatus', t:'Есть ли назначенные проверки?', multi:false, opts:['Да, скоро проверка','Были за последний год','Нет, пока спокойно'] },
    { id:'inspBody', t:'Какие органы беспокоят?', multi:true, opts:['Прокуратура','Россельхознадзор','Земельный контроль','Другое / не знаю'] }
  ],
  'Партнёрство для бухгалтерских фирм': [
    { id:'b2bClients', t:'Сколько у вас агро-клиентов?', multi:false, opts:['1–5','5–20','Больше 20'] },
    { id:'b2bNeed', t:'Что хотите закрыть?', multi:true, opts:['Ведение ГИС за клиентов','Земельные вопросы','Обучение сотрудников','Регламенты и шаблоны'] }
  ],
  'Нестандартная ситуация': []
};

let queue = [Q_FARM, Q_TRACKS];
let step = 0;
const state = {};

const body = document.getElementById('qbody');
const prog = document.getElementById('qprog');
const fmt = v => Array.isArray(v) ? v.join(', ') : (v || '');
const isSel = (q, o) => Array.isArray(state[q.id]) ? state[q.id].includes(o) : state[q.id] === o;

function render() {
  if (step < queue.length) renderQuestion(); else renderContacts();
  prog.style.width = Math.round(step / (queue.length + 1) * 100) + '%';
}

function renderQuestion() {
  const q = queue[step];
  body.innerHTML = '<h2>' + q.t + '</h2><p class="qhint">' + (q.hint || '') + '</p><div class="opts">' +
    q.opts.map(o => '<div class="opt' + (isSel(q, o) ? ' sel' : '') + '" data-v="' + o + '">' + o + '</div>').join('') +
    '</div><div class="qbtns">' +
    (step > 0 ? '<button class="btn btn-ghost" id="qback">← Назад</button>' : '<span></span>') +
    (q.multi ? '<button class="btn btn-yellow" id="qnext">Далее →</button>' : '') + '</div>';

  body.querySelectorAll('.opt').forEach(el => el.addEventListener('click', () => {
    if (q.multi) el.classList.toggle('sel');
    else { state[q.id] = el.dataset.v; step++; render(); }
  }));
  const back = document.getElementById('qback');
  if (back) back.addEventListener('click', () => { step--; render(); });
  const next = document.getElementById('qnext');
  if (next) next.addEventListener('click', () => {
    const sel = [...body.querySelectorAll('.opt.sel')].map(e => e.dataset.v);
    if (q.id === 'tracks' && !sel.length) { alert('Выберите хотя бы одно направление.'); return; }
    state[q.id] = sel;
    if (q.id === 'tracks') {
      queue = [Q_FARM, Q_TRACKS].concat(sel.flatMap(t => TRACK_QUESTIONS[t] || []));
      step = 2;
    } else step++;
    render();
  });
}

function renderContacts() {
  body.innerHTML = '<h2>Куда отправить отчёт?</h2><p class="qhint">Краткая версия появится сразу. Нестандартные ситуации разбирает эксперт вручную — бесплатно.</p>' +
    '<div class="qform"><label>Имя *</label><input id="c-name" placeholder="Ваше имя">' +
    '<label>Телефон *</label><input id="c-phone" type="tel" placeholder="+7 (___) ___-__-__">' +
    '<label>E-mail</label><input id="c-email" type="email" placeholder="для полного отчёта">' +
    '<label>Организация / ИНН</label><input id="c-org" placeholder="необязательно">' +
    '<label>Ситуация своими словами (необязательно)</label><textarea id="c-custom" style="width:100%;min-height:80px;padding:11px 12px;border:1px solid var(--line);border-radius:8px;font:inherit;background:#fbfaf7" placeholder="Опишите задачу в свободной форме — если не подходит ни один вариант, мы разберём её вручную"></textarea></div>' +
    '<div class="qbtns"><button class="btn btn-ghost" id="qback">← Назад</button><button class="btn btn-yellow" id="qfin">Получить отчёт →</button></div>';
  document.getElementById('qback').addEventListener('click', () => { step = queue.length - 1; render(); });
  document.getElementById('qfin').addEventListener('click', finish);
}

function gisMandatory() {
  const mand = new Set();
  const has = v => (state.activities || []).includes(v);
  if (has('Выращиваем зерно')) mand.add('zerno');
  if (has('Производим / продаём семена')) mand.add('semena');
  if (has('Применяем пестициды и агрохимикаты')) mand.add('saturn');
  if (mand.size || has('Только начинаем / не знаю')) mand.add('zsn');
  if (!mand.size) mand.add('zsn');
  return [...mand];
}

function calcUrgency() {
  let s = 0;
  if (state.gisFines === 'Да') s += 2;
  if (state.inspStatus === 'Да, скоро проверка') s += 2;
  if (state.subExp === 'Были отказы') s += 1;
  if (state.gisNow === 'Не ведём') s += 1;
  if (state.landStatus === 'Не оформлены' || state.landStatus === 'Паи (долевая собственность)') s += 1;
  return s >= 2 ? 'hot' : s >= 1 ? 'warm' : 'cold';
}

function nearestDeadline(mand) {
  const now = new Date(), y = now.getFullYear(), dates = [];
  if (mand.includes('zsn')) {
    dates.push({ d: new Date(y, 6, 1), t: 'ЕФГИС ЗСН — данные о посевах до 1 июля' });
    dates.push({ d: new Date(y, 11, 1), t: 'ЕФГИС ЗСН — данные об урожае до 1 декабря' });
  }
  const f = dates.filter(x => x.d >= now).sort((a, b) => a.d - b.d);
  return f.length ? f[0].t : 'Дедлайны привязаны к операциям: сбор урожая, обработки, реализация партий';
}

function finish() {
  const name = document.getElementById('c-name').value.trim();
  const phone = document.getElementById('c-phone').value.trim();
  if (!name || !phone) { alert('Заполните имя и телефон — иначе не сможем отправить отчёт.'); return; }

  const tracks = state.tracks || [];
  const urg = calcUrgency();
  const mand = tracks.includes('ГИС и отчётность') ? gisMandatory() : [];
  const mandNames = mand.map(k => SYS[k].n).join(', ');
  const custom = document.getElementById('c-custom').value.trim();

  let html = '<div class="r-head"><h2>' + name + ', ваш отчёт готов</h2><p>Данные зафиксированы: эксперт дополнит отчёт календарём на год и расчётом под ваш случай. Ниже — главное.</p><span class="urg ' + urg + '">' + ({hot:'Высокая срочность',warm:'Средняя срочность',cold:'Плановый режим'})[urg] + '</span></div>';

  if (tracks.includes('ГИС и отчётность')) {
    html += '<div class="r-block"><h3>ГИС: ваши обязательные системы</h3>' + mand.map(k =>
      '<div class="sys-row"><div class="ic">🗂</div><div><b>' + SYS[k].n + '</b><small>' + SYS[k].d + ' · Срок: ' + SYS[k].dl + '</small></div></div>').join('') +
      '<div class="risk"><b>' + nearestDeadline(mand) + '</b></div>' +
      mand.filter(k => SYS[k].f !== '—').map(k => '<div class="risk">Просрочка в <b>' + SYS[k].n + '</b>: ' + SYS[k].f + ' (' + SYS[k].law + ')</div>').join('') +
      '<div class="sys-row"><div class="ic">₽</div><div>' + SYS.zsn.price + '</div></div></div>';
  }
  if (tracks.includes('Земля и документы')) {
    html += '<div class="r-block"><h3>Земля: задачи и риски</h3>' +
      '<div class="risk">' + (KB.landRisks[state.landStatus] || KB.landRisks['Смешанная']) + '</div>' +
      '<div class="sys-row"><div class="ic">📐</div><div>Ваши задачи: ' + (fmt(state.landNeed) || 'уточним при диагностике') + '</div></div>' +
      '<div class="sys-row"><div class="ic">₽</div><div>' + KB.landPrices + '</div></div></div>';
  }
  if (tracks.includes('Аукционы и покупка активов')) {
    html += '<div class="r-block"><h3>Аукционы: что можно купить</h3><div class="risk">' + KB.auctionNote + '</div>' +
      KB.auctionSteps.map((s, i) => '<div class="sys-row"><div class="ic">' + (i + 1) + '</div><div>' + s + '</div></div>').join('') +
      '<div class="sys-row"><div class="ic">₽</div><div>' + KB.auctionPrice + '</div></div></div>';
  }
  if (tracks.includes('Субсидии и гранты')) {
    html += '<div class="r-block"><h3>Субсидии: ваша ситуация</h3>' +
      '<div class="risk">' + (state.subExp === 'Были отказы' ? KB.subRefused : state.subExp === 'Да, получаем' ? 'Вы уже в системе поддержки. Проверим, все ли доступные программы выбраны и нет ли рисков по отчётности.' : KB.subNone) + '</div>' +
      '<div class="sys-row"><div class="ic">📋</div><div>Интересующие программы: ' + (fmt(state.subType) || 'определим при диагностике') + '</div></div>' +
      '<div class="risk">' + KB.subDeadline + '</div>' +
      '<div class="sys-row"><div class="ic">₽</div><div>' + KB.subPrice + '</div></div></div>';
  }
  if (tracks.includes('Подготовка к проверкам')) {
    html += '<div class="r-block"><h3>Проверки: план подготовки</h3>' +
      '<div class="risk">' + (state.inspStatus === 'Да, скоро проверка' ? KB.auditPlanned : state.inspStatus === 'Были за последний год' ? KB.auditPast : KB.auditNone) + '</div>' +
      '<div class="sys-row"><div class="ic">🛡</div><div>Органы: ' + (fmt(state.inspBody) || 'уточним при диагностике') + '. Этапы: аудит документов → устранение нарушений → сопровождение проверки.</div></div>' +
      '<div class="sys-row"><div class="ic">₽</div><div>' + KB.auditPrice + '</div></div></div>';
  }
  if (tracks.includes('Партнёрство для бухгалтерских фирм')) {
    html += '<div class="r-block"><h3>Партнёрство</h3><div class="risk">' + KB.b2bOffer + '</div>' +
      '<div class="sys-row"><div class="ic">🤝</div><div>Ваши запросы: ' + fmt(state.b2bNeed) + ' · Агро-клиентов: ' + (state.b2bClients || '—') + '</div></div></div>';
  }
  if (tracks.includes('Нестандартная ситуация') || custom) {
    html += '<div class="r-block"><h3>Нестандартная ситуация</h3><div class="sys-row"><div class="ic">✍</div><div>Ваша ситуация зафиксирована и передана эксперту. Разберём вручную и предложим решение — это бесплатно и ни к чему не обязывает.</div></div></div>';
  }
  if (!tracks.length) {
    html += '<div class="r-block"><h3>Что дальше</h3><div class="sys-row"><div class="ic">📞</div><div>Вы не выбрали направления — эксперт на бесплатной диагностике поможет определить, что именно нужно вашему хозяйству.</div></div></div>';
  }

  const plan = [];
  if (tracks.includes('ГИС и отчётность')) plan.push('Закрыть просрочки по обязательным ГИС: ' + (mandNames || 'список уточним'));
  if (tracks.includes('Подготовка к проверкам')) plan.push('Подготовить документы к проверке и устранить нарушения');
  if (tracks.includes('Земля и документы')) plan.push('Решить земельные задачи: ' + (fmt(state.landNeed) || 'аудит документов'));
  if (tracks.includes('Субсидии и гранты')) plan.push('Подобрать программы поддержки и подготовить заявку');
  if (tracks.includes('Аукционы и покупка активов')) plan.push('Настроить мониторинг подходящих торгов');
  if (tracks.includes('Партнёрство для бухгалтерских фирм')) plan.push('Обсудить модель партнёрства и агентские цены');
  if (custom || tracks.includes('Нестандартная ситуация')) plan.push('Получить разбор нестандартной ситуации от эксперта');
  if (!plan.length) plan.push('Определить перечень обязательных требований на диагностике');
  html += '<div class="r-block"><h3>План действий</h3>' + plan.slice(0, 4).map((s, i) =>
    '<div class="sys-row"><div class="ic">' + (i + 1) + '</div><div>' + s + '</div></div>').join('') + '</div>';

  // Кнопка PDF появляется только если подключена библиотека html2pdf в diagnostika.html
  if (window.html2pdf) {
    html += '<div class="qbtns"><button class="btn btn-ghost" id="dlpdf">⬇ Скачать PDF</button></div>';
  }
  html += '<div class="qbtns"><a class="btn btn-yellow" href="index.html#lead">Обсудить отчёт с экспертом →</a><a class="btn btn-ghost" href="diagnostika.html">Пройти ещё раз</a></div>' +
    '<p class="r-note">Отчёт предварительный и не является юридическим заключением.</p>';

  document.getElementById('quiz').style.display = 'none';
  const res = document.getElementById('result');
  res.style.display = 'block';
  res.innerHTML = html;
  prog.style.width = '100%';

  const dl = document.getElementById('dlpdf');
  if (dl) dl.addEventListener('click', () => {
    const hides = res.querySelectorAll('.qbtns');
    hides.forEach(b => b.style.display = 'none');
    html2pdf().set({ margin: 8, filename: 'АгроОтдел_отчёт.pdf', html2canvas: { scale: 2 }, jsPDF: { unit: 'mm', format: 'a4' } })
      .from(res).save().then(() => hides.forEach(b => b.style.display = ''));
  });

  const details = queue.slice(2).map(q => q.t + ' — ' + fmt(state[q.id])).join('; ');
  fetch(WEB_APP_URL, {
    method: 'POST', mode: 'no-cors',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({
      quiz: true, name, phone,
      email: document.getElementById('c-email').value.trim(),
      org: document.getElementById('c-org').value.trim(),
      farmType: state.farmType, tracks: tracks.join(', '),
      urgency: urg, mandatory: mandNames, details, custom,
      source: location.href
    })
  }).catch(() => {});
}

render();