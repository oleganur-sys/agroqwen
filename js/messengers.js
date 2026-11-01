/* ЗемОтдел — единый модуль мессенджеров: кнопки, QR, модалка, FAB. v20261014d */
(function () {
  var IC_WA  = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4gPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2Ny4xOSA2Ny41MiI+IDxkZWZzPiA8c3R5bGU+LmNscy0xe2ZpbGw6I2ZmZjtmaWxsLXJ1bGU6ZXZlbm9kZDt9PC9zdHlsZT4gPC9kZWZzPiA8ZyBpZD0i0KHQu9C+0LlfMiIgZGF0YS1uYW1lPSLQodC70L7QuSAyIj4gPGcgaWQ9ItCh0LvQvtC5XzEtMiIgZGF0YS1uYW1lPSLQodC70L7QuSAxIj4gPGcgaWQ9IldBX0xvZ28iIGRhdGEtbmFtZT0iV0EgTG9nbyI+IDxwYXRoIGNsYXNzPSJjbHMtMSIgZD0iTTU3LjQsOS44MUEzMy40NiwzMy40NiwwLDAsMCw0Ljc1LDUwLjE4TDAsNjcuNTJsMTcuNzQtNC42NmEzMy40MiwzMy40MiwwLDAsMCwxNiw0LjA4aDBBMzMuNDcsMzMuNDcsMCwwLDAsNTcuNCw5LjgxWk0zMy43NCw2MS4yOWgwYTI3LjkxLDI3LjkxLDAsMCwxLTE0LjE2LTMuODhsLTEtLjZMOCw1OS41N2wyLjgxLTEwLjI2LS42Ni0xLjA2YTI3LjgsMjcuOCwwLDEsMSwyMy41NiwxM1pNNDksNDAuNDZjLS44NC0uNDItNS0yLjQ0LTUuNzEtMi43MnMtMS4zMy0uNDItMS44OC40Mi0yLjE2LDIuNzItMi42NSwzLjI4LTEsLjYyLTEuODEuMjFhMjMsMjMsMCwwLDEtNi43Mi00LjE1LDI1LjA1LDI1LjA1LDAsMCwxLTQuNjUtNS43OWMtLjQ5LS44NC0uMDYtMS4yOS4zNi0xLjcxcy44NC0xLDEuMjYtMS40N0E1Ljc1LDUuNzUsMCwwLDAsMjgsMjcuMTQsMS41MiwxLjUyLDAsMCwwLDI4LDI1LjY4Yy0uMjEtLjQyLTEuODgtNC41NC0yLjU3LTYuMjFTMjQsMTguMDYsMjMuNDksMThzLTEsMC0xLjYsMGEzLjA4LDMuMDgsMCwwLDAtMi4yMywxLjA1LDkuNDEsOS40MSwwLDAsMC0yLjkyLDdjMCw0LjEyLDMsOC4wOSwzLjQxLDguNjVzNS45LDksMTQuMjgsMTIuNjJhNDQuNjYsNDQuNjYsMCwwLDAsNC43NywxLjc2LDExLjQ3LDExLjQ3LDAsMCwwLDUuMjYuMzRjMS42MS0uMjQsNC45NS0yLDUuNjQtNGE2Ljk0LDYuOTQsMCwwLDAsLjQ5LTRDNTAuMzgsNDEuMDksNDkuODMsNDAuODgsNDksNDAuNDZaIj48L3BhdGg+IDwvZz4gPC9nPiA8L2c+IDwvc3ZnPiA=';
  var IC_TG  = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4gPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2Ni4yNSA1NC44NSI+IDxkZWZzPiA8c3R5bGU+LmNscy0xe2ZpbGw6I2ZmZjt9PC9zdHlsZT4gPC9kZWZzPiA8ZyBpZD0i0KHQu9C+0LlfMiIgZGF0YS1uYW1lPSLQodC70L7QuSAyIj4gPGcgaWQ9ItCh0LvQvtC5XzEtMiIgZGF0YS1uYW1lPSLQodC70L7QuSAxIj4gPHBhdGggY2xhc3M9ImNscy0xIiBkPSJNNjYuMjUsNGMwLS4zOC0uMDgtLjgtLjEzLTEuMjNBMi41OCwyLjU4LDAsMCwwLDYzLjcyLjA5LDcuNTcsNy41NywwLDAsMCw2MCwuNTZDNTUuMTYsMiw1MC41Niw0LDQ1LjkzLDUuOTJjLTExLjY3LDQuNzctMjMuMjIsOS44NC0zNC43OSwxNC44NnEtNC4yNiwxLjg0LTguNDksMy43M0E2LjIzLDYuMjMsMCwwLDAsLjU1LDI2LDEuNzMsMS43MywwLDAsMCwuNjksMjguNiw0LjA1LDQuMDUsMCwwLDAsMiwyOS40MSwxMDAuMTIsMTAwLjEyLDAsMCwwLDEzLjMsMzIuODRhMTAuNTYsMTAuNTYsMCwwLDAsOC43Ni0xLjY4bDQuNDEtM2M2LjkyLTQuNjIsMTMuNzgtOS4zMywyMC44LTEzLjhhNC44LDQuOCwwLDAsMSwxLjI5LS42NywxLDEsMCwwLDEsMS4yNi4zMywxLjA3LDEuMDcsMCwwLDEtLjA4LDEuMzYsOS4xNSw5LjE1LDAsMCwxLS42Mi43NWMtMi41NywyLjctNS4yNyw1LjI2LTgsNy44MkMzNy42MiwyNy4zMywzNCwzMC41NiwzMC41NiwzNGE4Ljc1LDguNzUsMCwwLDAtMS4yOSwxLjYyLDIuNzIsMi43MiwwLDAsMCwuMjMsMy40NCwxMC44LDEwLjgsMCwwLDAsMi41NiwyLjE1cTgsNS40MywxNi4wNywxMC44N2MuODMuNTYsMS42NCwxLjE0LDIuNTEsMS42MmE4LjM4LDguMzgsMCwwLDAsMywxLjA2QTMuNzYsMy43NiwwLDAsMCw1OCw1Mi40OGExNi4wNywxNi4wNywwLDAsMCwxLjM2LTQuNTRjMi4yNC0xMi4zMyw0LjM0LTI0LjY4LDYuMDYtMzcuMDlDNjUuNzgsOC41Nyw2Ni4wNyw2LjI5LDY2LjI1LDRaIj48L3BhdGg+IDwvZz4gPC9nPiA8L3N2Zz4g';
  var IC_MAX = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1MDAgNTAwIiB3aWR0aD0iNTAwIiBoZWlnaHQ9IjUwMCIgZmlsbD0ibm9uZSIgcm9sZT0iaW1nIiBhcmlhLWxhYmVsPSJNQVgiPjxwYXRoIGZpbGw9IiNmZmYiIGZpbGwtcnVsZT0iZXZlbm9kZCIgZD0iTTI1My4yMjMgMzk4Ljg1Yy0yOS40NDEgMC00My4xMjMtNC4yOTgtNjYuOTA1LTIxLjQ5LTE1LjA0MyAxOS4zNDEtNjIuNjc5IDM0LjQ1Ni02NC43NTYgOC41OTYgMC0xOS40MTItNC4yOTgtMzUuODE2LTkuMTctNTMuNzI1QzEwNi41OSAzMTAuMTY4IDEwMCAyODUuNTk4IDEwMCAyNDkuOTk3IDEwMCAxNjQuOTY4IDE2OS43NzEgMTAxIDI1Mi40MzUgMTAxYzgyLjczNiAwIDE0Ny41NjQgNjcuMTIgMTQ3LjU2NCAxNDkuNzg0LjI3OCA4MS4zODYtNjUuMzkxIDE0Ny42MzItMTQ2Ljc3NiAxNDguMDY2bTEuMjE4LTIyNC4zNTVjLTQwLjI1OC0yLjA3Ny03MS42MzMgMjUuNzg4LTc4LjU4MiA2OS40ODQtNS43MyAzNi4xNzUgNC40NDIgODAuMjI5IDEzLjEwOSA4Mi41MjIgNC4xNTUgMS4wMDIgMTQuNjEzLTcuNDUgMjEuMTMyLTEzLjk2OWE3NC41IDc0LjUgMCAwIDAgMzYuMzkgMTIuOTY2YzQxLjcxMyAyLjAwNiA3Ny4zNTYtMjkuNzUgODAuMTU3LTcxLjQxOCAxLjYzLTQxLjc1Ni0zMC40ODctNzcuMTIzLTcyLjIwNi03OS41MTN6IiBjbGlwLXJ1bGU9ImV2ZW5vZGQiLz48L3N2Zz4=';

  var M = {
    wa:  { url:'https://wa.me/79297856151',                                   grad:'linear-gradient(135deg,#3BD16F 0%,#1FA855 100%)', ic:IC_WA,  lbl:'WhatsApp' },
    tg:  { url:'https://t.me/zemotdelGIS',                                    grad:'linear-gradient(135deg,#37AEE2 0%,#1E96C8 100%)', ic:IC_TG,  lbl:'Telegram' },
    max: { url:'https://max.ru/u/f9LHodD0cOJUGcz1AaXKIjwi_hHs1mCC1F7y1FuzWHbFwTcm6F1E0k5Mktw', grad:'linear-gradient(135deg,#8B5CF6 0%,#C13AFF 100%)', ic:IC_MAX, lbl:'МАКС' }
  };
  var ORDER = ['wa','tg','max'];

  function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

  function button(kind, opts) {
    var m = M[kind]; if (!m) return '';
    var big = opts && opts.big;
    return '<a class="zq-btn' + (big ? ' zq-btn-big' : '') + '" href="' + esc(m.url) + '" target="_blank" rel="noopener" title="' + esc(m.lbl) + '" aria-label="' + esc(m.lbl) + '">'
         + '<span class="zq-ic" style="background:' + m.grad + '"><img src="' + m.ic + '" alt=""></span></a>';
  }
  function buttonsRow(opts) { var h=''; for (var i=0;i<ORDER.length;i++) h+=button(ORDER[i],opts); return h; }

  function qrSlot(kind) {
    var m = M[kind]; if (!m) return '';
    return '<div class="zq-qr"><div class="zq-qrslot" data-href="' + esc(m.url) + '"></div>'
         + '<span class="zq-qrlogo" style="background:' + m.grad + '"><img src="' + m.ic + '" alt=""></span></div>';
  }
  function qrRow() { var h=''; for (var i=0;i<ORDER.length;i++) h+=qrSlot(ORDER[i]); return h; }

  // Матрица QR -> canvas -> PNG-dataURL (html2canvas-совместимо). Рисуем в <img>, а не в <svg>.
  function paintQrs(root) {
    root = root || document;
    if (typeof qrcode !== 'function') return;
    var slots = root.querySelectorAll('.zq-qrslot');
    for (var i=0;i<slots.length;i++) {
      var slot = slots[i];
      if (slot.getAttribute('data-painted') === '1') continue;
      var url = slot.getAttribute('data-href') || '';
      if (!url) continue;
      try {
        var q = qrcode(0, url.length > 50 ? 'M' : 'H'); q.addData(url, 'Byte'); q.make();
        var n = q.getModuleCount(), quiet = 2, TARGET = 560, cell = TARGET / (n + quiet*2);
        var cv = document.createElement('canvas'); cv.width = TARGET; cv.height = TARGET;
        var ctx = cv.getContext('2d');
        ctx.fillStyle = '#fff'; ctx.fillRect(0,0,TARGET,TARGET);
        ctx.fillStyle = '#000';
        for (var r=0;r<n;r++) for (var c=0;c<n;c++) if (q.isDark(r,c)) ctx.fillRect((c+quiet)*cell,(r+quiet)*cell,Math.ceil(cell),Math.ceil(cell));
        var img = document.createElement('img');
        img.className = 'zq-qrimg'; img.alt = 'QR'; img.src = cv.toDataURL('image/png');
        slot.innerHTML = ''; slot.appendChild(img);
        slot.setAttribute('data-painted','1');
      } catch (e) {}
    }
  }

  // Перед печатью PDF: SVG-иконки -> PNG по их реальному CSS-размеру (html2canvas не рисует SVG).
  function rasterizeForPrint(root) {
    root = root || document;
    var imgs = root.querySelectorAll('img[src^="data:image/svg"]');
    var jobs = [];
    for (var i=0;i<imgs.length;i++) {
      (function(img){
        var rect = img.getBoundingClientRect();
        var dpr = 2;
        var w = Math.max(1, Math.round((rect.width||24)*dpr));
        var h = Math.max(1, Math.round((rect.height||24)*dpr));
        jobs.push(new Promise(function(res){
          var im = new Image();
          im.onload = function(){
            try {
              var cv = document.createElement('canvas'); cv.width=w; cv.height=h;
              var ctx = cv.getContext('2d'); ctx.drawImage(im,0,0,w,h);
              img.src = cv.toDataURL('image/png');
            } catch(e){}
            res();
          };
          im.onerror = res;
          im.src = img.getAttribute('src');
        }));
      })(imgs[i]);
    }
    return Promise.all(jobs);
  }

  function initModal() {
    var ov = document.getElementById('zq-ov'); if (!ov) return;
    var fab = document.querySelector('.zq-fab');
    var opener = null;
    function focusables(){ return Array.prototype.slice.call(ov.querySelectorAll('a[href],button')); }
    function open(e){ if(e){ e.preventDefault(); opener = e.target && e.target.closest ? e.target.closest('a') : null; }
      ov.hidden = false; document.body.style.overflow='hidden'; paintQrs(ov);
      var f = focusables(); if (f[0] && f[0].focus) f[0].focus(); }
    function close(){ ov.hidden = true; document.body.style.overflow=''; if (opener && opener.focus) opener.focus(); }
    if (fab) fab.addEventListener('click', open);
    document.addEventListener('click', function(e){
      var a = e.target.closest && e.target.closest('a[href="#zq-messenger"]');
      if (a && !a.classList.contains('zq-btn')) { open(e); return; }
      if (e.target.closest && e.target.closest('.zq-close')) { close(); return; }
      if (e.target === ov) close();
    });
    document.addEventListener('keydown', function(e){
      if (e.key === 'Escape' && !ov.hidden) { close(); return; }
      if (e.key === 'Tab' && !ov.hidden) {
        var f = focusables(); if (!f.length) return;
        var first=f[0], last=f[f.length-1];
        if (e.shiftKey && document.activeElement===first){ e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement===last){ e.preventDefault(); first.focus(); }
      }
    });
  }

  function init() {
    var bs = document.querySelectorAll('[data-zq="buttons"]');
    for (var i=0;i<bs.length;i++) bs[i].innerHTML = buttonsRow({ big: bs[i].hasAttribute('data-big') });
    var qs = document.querySelectorAll('[data-zq="qr"]');
    for (var j=0;j<qs.length;j++) qs[j].innerHTML = qrRow();
    var fab = document.querySelector('[data-zq="fab"]');
    if (fab) { var h=''; for (var k=0;k<ORDER.length;k++){ var m=M[ORDER[k]]; h+='<span class="zq-fabi" style="background:'+m.grad+';animation-delay:'+(-k*2.5)+'s"><img src="'+m.ic+'" alt=""></span>'; } fab.innerHTML = h; }
    var ics = document.querySelectorAll('[data-zq-icon]');
    for (var q = 0; q < ics.length; q++) { var kk = ics[q].getAttribute('data-zq-icon'); if (M[kk]) { ics[q].style.background = M[kk].grad; ics[q].innerHTML = '<img src="' + M[kk].ic + '" alt="">'; } }
    paintQrs(document);
    initModal();
  }

  window.zqm = { M:M, button:button, buttonsRow:buttonsRow, qrSlot:qrSlot, qrRow:qrRow, paintQrs:paintQrs, rasterizeForPrint:rasterizeForPrint };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();