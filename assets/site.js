/* DailyLang 官网 · 语言切换（zh-Hans / zh-Hant / en / vi / ja / ko / km / lo）
   ----------------------------------------------------------------------------
   页面需以 <html lang="zh-Hans" data-lang="zh-Hans"> 起步；
   正文中按语言写 .i18n-zh / .i18n-zh-Hant / .i18n-en / .i18n-vi /
   .i18n-ja / .i18n-ko / .i18n-km / .i18n-lo，由 data-lang 决定显示哪一份。
   顶栏/文档导航里的 <select data-lang-select> 切换语言，并把选择写入 localStorage。 */
(function () {
  var KEY = 'dailylang.lang';
  var DEFAULT = 'zh-Hans';
  var SUPPORTED = ['zh-Hans', 'zh-Hant', 'en', 'vi', 'ja', 'ko', 'km', 'lo'];
  var TITLE_ATTR = {
    'zh-Hans': 'titleZh', 'zh-Hant': 'titleZhHant', 'en': 'titleEn', 'vi': 'titleVi',
    'ja': 'titleJa', 'ko': 'titleKo', 'km': 'titleKm', 'lo': 'titleLo'
  };
  var root = document.documentElement;

  function apply(lang) {
    if (SUPPORTED.indexOf(lang) === -1) lang = DEFAULT;
    root.setAttribute('data-lang', lang);
    root.setAttribute('lang', lang);

    // 可选：<html data-title-zh="…" data-title-en="…"> 让标签页标题跟随语言
    var title = root.dataset[TITLE_ATTR[lang]];
    if (title) document.title = title;

    var selects = document.querySelectorAll('select[data-lang-select]');
    for (var i = 0; i < selects.length; i++) {
      if (selects[i].value !== lang) selects[i].value = lang;
    }
  }

  document.addEventListener('change', function (event) {
    var select = event.target && event.target.closest
      ? event.target.closest('select[data-lang-select]') : null;
    if (!select) return;

    var lang = select.value;
    try { localStorage.setItem(KEY, lang); } catch (e) { /* 隐私模式下忽略 */ }
    apply(lang);
  });

  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) { /* 忽略 */ }

  apply(saved || root.getAttribute('data-lang') || DEFAULT);
})();

/* ---------- 页脚联系方式弹层：点 QQ / 微信图标显示账号，支持一键复制 ---------- */
(function () {
  var openPop = null;

  function closePop() {
    if (!openPop) return;
    openPop.hidden = true;
    openPop = null;
    document.body.style.overflow = '';
  }

  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch (e) { /* 隐私模式下忽略 */ }
    document.body.removeChild(ta);
  }

  document.addEventListener('click', function (event) {
    if (!event.target || !event.target.closest) return;

    var opener = event.target.closest('[data-contact]');
    if (opener) {
      closePop();
      var pop = document.getElementById(opener.getAttribute('data-contact'));
      if (pop) {
        pop.hidden = false;
        openPop = pop;
        document.body.style.overflow = 'hidden';
      }
      return;
    }

    if (openPop) {
      if (event.target.closest('[data-pop-close]')) { closePop(); return; }
      if (!event.target.closest('.contact-pop__card')) { closePop(); return; }
    }

    var copyBtn = event.target.closest('.contact-pop__copy');
    if (copyBtn) {
      var text = copyBtn.getAttribute('data-copy') || '';
      var done = function () {
        copyBtn.classList.add('copied');
        setTimeout(function () { copyBtn.classList.remove('copied'); }, 1600);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, function () { fallbackCopy(text); done(); });
      } else {
        fallbackCopy(text);
        done();
      }
    }
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') closePop();
  });
})();
