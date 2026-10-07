const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbxqqQDf9RGzeIVYcGDQciitvmC-_pPcRhGON_W5mtfApmL4yr-j4983oq-7qR8sHsp_WA/exec';

function leadCollect(form) {
  const inForm = (sels) => {
    for (const s of sels) {
      const el = form.querySelector(s);
      if (el && el.value && el.value.trim()) return el.value.trim();
    }
    return '';
  };
  const name  = inForm(['[name="name"]', 'input[placeholder*="имя" i]', 'input[placeholder*="должность" i]', 'input[type="text"]']);
  const phone = inForm(['[name="phone"]', 'input[type="tel"]', 'input[placeholder*="телефон" i]', 'input[placeholder*="+7"]']);
  const email = inForm(['[name="email"]', 'input[type="email"]', 'input[placeholder*="mail" i]']);
  const org   = inForm(['[name="org"]', 'input[placeholder*="ИНН" i]', 'input[placeholder*="организаци" i]']);
  const whoEl = form.querySelector('[name="who"]') || form.querySelector('select');
  const msg   = inForm(['[name="message"]', 'textarea']);

  let interest = [...form.querySelectorAll('input[name="interest"]:checked')].map(c => c.value).join(', ');
  if (!interest) {
    interest = [...form.querySelectorAll('input[type="checkbox"]:checked')]
      .map(c => (c.closest('label') ? c.closest('label').textContent : c.value).trim())
      .filter(t => t && !/персональн/i.test(t))
      .join(', ');
  }
  if (!interest) {
    interest = [...form.querySelectorAll('.chip.active, [aria-pressed="true"]')]
      .map(b => b.textContent.trim()).join(', ');
  }

  const agreeBox = [...form.querySelectorAll('input[type="checkbox"]')]
    .find(c => c.closest('label') && /персональн/i.test(c.closest('label').textContent));

  return { name, phone, email, org, who: whoEl ? whoEl.value : '', interest, message: msg, agreeBox };
}

window.leadDebug = () => {
  const form = document.getElementById('lead-form') || document.querySelector('form');
  const d = leadCollect(form);
  console.log('Найдено формой:', { name: d.name, phone: d.phone, email: d.email, org: d.org, who: d.who, interest: d.interest, message: d.message, согласие: d.agreeBox ? d.agreeBox.checked : 'чекбокс не найден' });
  return d;
};

document.addEventListener('submit', async (e) => {
  const form = e.target;
  if (!form || form.tagName !== 'FORM') return;
  if (!(form.id === 'lead-form' || form.querySelector('input[type="tel"]'))) return;

  e.preventDefault();
  const d = leadCollect(form);

  if (d.agreeBox && !d.agreeBox.checked) {
    alert('Отметьте согласие на обработку персональных данных.');
    return;
  }
  if (!d.name || !d.phone) {
    alert('Заполните имя и телефон — иначе мы не сможем связаться.');
    return;
  }

  const btn = form.querySelector('button[type="submit"]') || form.querySelector('button');
  const oldText = btn.textContent;
  btn.disabled = true;
  btn.textContent = 'Отправляем...';

  try {
    await fetch(WEB_APP_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        name: d.name, phone: d.phone, email: d.email, org: d.org,
        who: d.who, interest: d.interest, message: d.message, source: location.href
      })
    });
    form.reset();
    btn.textContent = 'Заявка отправлена ✓';
    let xs = document.getElementById('xsell');
    if (!xs) {
      xs = document.createElement('div'); xs.id = 'xsell';
      xs.style.cssText = 'margin-top:12px;font-size:13px;color:#6d736d;text-align:center';
      form.appendChild(xs);
    }
    xs.innerHTML = 'Пока обрабатываем заявку — пройдите <a href="diagnostika.html" style="color:#12352b;font-weight:600">бесплатную диагностику за 2 минуты</a>.';
    setTimeout(() => { btn.textContent = oldText; btn.disabled = false; }, 4000);
  } catch (err) {
    alert('Ошибка сети. Попробуйте ещё раз или позвоните нам.');
    btn.disabled = false;
    btn.textContent = oldText;
  }
});