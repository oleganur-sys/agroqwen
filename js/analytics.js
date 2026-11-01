/* ЗемОтдел — P2: cookie-баннер + Яндекс Метрика с блокировкой до согласия + цели. v20261017 */
(function () {
  var CONSENT_KEY = 'zq_consent';
  var METRICA_ID  = '113663547';

  var ready = false;

  function consentGet() { try { return localStorage.getItem(CONSENT_KEY); } catch (e) { return null; } }
  function consentSet(v) { try { localStorage.setItem(CONSENT_KEY, v); } catch (e) {} }

  function goal(name, params) {
    if (!ready || typeof window.ym !== 'function') return;
    try { window.ym(METRICA_ID, 'reachGoal', name, params); } catch (e) {}
  }

  function loadMetrika() {
    if (window.__zqMetrika) return;
    if (!/^\d+$/.test(String(METRICA_ID))) return;
    window.__zqMetrika = true;
    (function (m, e, t, r, i, k, a) {
      m[i] = m[i] || function () { (m[i].a = m[i].a || []).push(arguments); };
      m[i].l = 1 * new Date();
      for (var j = 0; j < e.scripts.length; j++) { if (e.scripts[j].src === r) return; }
      k = e.createElement(t); a = e.getElementsByTagName(t)[0];
      k.async = 1; k.src = r; a.parentNode.insertBefore(k, a);
    })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js', 'ym');
    window.ym(METRICA_ID, 'init', {
      clickmap: true, trackLinks: true, accurateTrackBounce: true, webvisor: true
    });
    ready = true;
  }

  var _fetch = window.fetch;
  window.fetch = function (input, init) {
    var url  = (typeof input === 'string') ? input : (input && input.url) || '';
    var body = (init && init.body) ? String(init.body) : '';
    var p = _fetch.apply(this, arguments);
    if (url.indexOf('lead.php') !== -1) {
      p.then(function (res) {
        if (!res || !res.ok) return;
        var isQuiz = body.indexOf('"quiz":true') !== -1 || body.indexOf('"quiz": true') !== -1;
        goal(isQuiz ? 'quiz_lead_sent' : 'lead_form_submit');
      }).catch(function () {});
    }
    return p;
  };

  function messengerOf(href) {
    if (/wa\.me\//.test(href)) return 'whatsapp';
    if (/t\.me\//.test(href)) return 'telegram';
    if (/max\.ru\//.test(href)) return 'max';
    return '';
  }
  document.addEventListener('click', function (e) {
    var a = e.target && e.target.closest ? e.target.closest('a') : null;
    if (!a) return;
    var href = a.getAttribute('href') || '';
    if (a.classList.contains('zq-btn') || a.classList.contains('mobile-bar-btn') || messengerOf(href)) {
      var mg = messengerOf(href);
      if (mg) goal('messenger_click', { messenger: mg });
    }
    if (a.classList.contains('zq-fab') || href === '#zq-messenger') {
      goal('messenger_modal_open');
    }
  }, true);

  function injectStyle() {
    if (document.getElementById('zq-cookie-style')) return;
    var s = document.createElement('style'); s.id = 'zq-cookie-style';
    s.textContent =
      '.zq-cookie{position:fixed;left:0;right:0;bottom:0;z-index:9990;background:#0f2c22;color:#eaf3ee;' +
      'padding:14px 18px;box-shadow:0 -8px 24px rgba(0,0,0,.25);font-size:13.5px;line-height:1.5;' +
      'display:flex;gap:14px;align-items:center;flex-wrap:wrap}' +
      '.zq-cookie p{margin:0;flex:1 1 320px}' +
      '.zq-cookie a{color:#f2b544;text-decoration:underline}' +
      '.zq-cookie-btns{display:flex;gap:10px;flex-wrap:wrap}' +
      '.zq-cookie button{border:0;border-radius:9px;padding:9px 16px;font:inherit;font-weight:700;cursor:pointer}' +
      '.zq-cookie .zq-yes{background:#f29d18;color:#1a1206}' +
      '.zq-cookie .zq-no{background:transparent;color:#eaf3ee;border:1px solid rgba(255,255,255,.3)}' +
      '@media(max-width:640px){.zq-cookie{bottom:88px;font-size:12.5px;padding:12px 14px;border-radius:14px 14px 0 0}' +
      '.zq-cookie-btns{width:100%}.zq-cookie button{flex:1}}';
    document.head.appendChild(s);
  }

  function showBanner() {
    injectStyle();
    var el = document.createElement('div');
    el.className = 'zq-cookie'; el.id = 'zq-cookie';
    el.setAttribute('role', 'dialog');
    el.setAttribute('aria-label', 'Согласие на файлы cookie и аналитику');
    el.innerHTML =
      '<p>Мы используем файлы cookie и Яндекс Метрику, чтобы сайт работал удобнее и мы понимали, какие услуги востребованы. ' +
      'Это не влияет на отправку заявок. Подробнее — <a href="policy.html">политика конфиденциальности</a>.</p>' +
      '<div class="zq-cookie-btns">' +
      '<button class="zq-no" type="button">Только необходимое</button>' +
      '<button class="zq-yes" type="button">Принять аналитику</button>' +
      '</div>';
    document.body.appendChild(el);
    document.body.classList.add('zq-banner-open'); // <--- НОВАЯ СТРОКА
    
    el.querySelector('.zq-yes').addEventListener('click', function () {
      consentSet('granted'); el.remove(); document.body.classList.remove('zq-banner-open'); loadMetrika();
    });
    el.querySelector('.zq-no').addEventListener('click', function () {
      consentSet('rejected'); el.remove(); document.body.classList.remove('zq-banner-open');
    });
  }

  function init() {
    var c = consentGet();
    if (c === 'granted') { loadMetrika(); return; }
    if (c === 'rejected') return;
    showBanner();
  }

  window.zqAnalytics = { reset: function () { consentSet(null); location.reload(); } };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();