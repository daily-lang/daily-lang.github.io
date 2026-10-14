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
