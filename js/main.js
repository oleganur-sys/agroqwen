// ЖИВАЯ МАСКА ТЕЛЕФОНА (+7 (XXX) XXX-XX-XX)
(function() {
  function formatPhone(val) {
    let digits = val.replace(/\D/g, '');
    if (!digits) return '';

    // Если начали ввод с 9, 8 или 7
    if (['7', '8', '9'].indexOf(digits[0]) > -1) {
      if (digits[0] === '9') digits = '7' + digits;
      else digits = '7' + digits.substring(1);
    } else {
      return '+' + digits.substring(0, 15);
    }

    let res = '+7 (';
    if (digits.length > 1) res += digits.substring(1, 4);
    if (digits.length >= 5) res += ') ' + digits.substring(4, 7);
    if (digits.length >= 8) res += '-' + digits.substring(7, 9);
    if (digits.length >= 10) res += '-' + digits.substring(9, 11);
    return res;
  }

  // При вводе цифр — моментальное форматирование
  document.addEventListener('input', function(e) {
    const input = e.target;
    if (!input || input.type !== 'tel') return;
    const digits = input.value.replace(/\D/g, '');
    if (!digits) {
      input.value = '';
      return;
    }
    input.value = formatPhone(input.value);
  });

  // При клике в пустое поле — сразу выставляем +7 (
  document.addEventListener('focusin', function(e) {
    const input = e.target;
    if (!input || input.type !== 'tel') return;
    if (!input.value.trim()) {
      input.value = '+7 (';
    }
  });

  // Если ушли из поля, не начав вводить номер — очищаем
  document.addEventListener('focusout', function(e) {
    const input = e.target;
    if (!input || input.type !== 'tel') return;
    const digits = input.value.replace(/\D/g, '');
    if (digits.length <= 1) {
      input.value = '';
    }
  });

  // Корректная обработка Backspace
  document.addEventListener('keydown', function(e) {
    const input = e.target;
    if (!input || input.type !== 'tel') return;
    if (e.key === 'Backspace') {
      const digits = input.value.replace(/\D/g, '');
      if (digits.length <= 1) {
        input.value = '';
      }
    }
  });
})();