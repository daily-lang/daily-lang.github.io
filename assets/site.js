/* DailyLang 官网 · 语言切换（简体中文 / English）
   ----------------------------------------------------------------------------
   页面需以 <html lang="zh-Hans" data-lang="zh-Hans"> 起步；
   正文中成对出现 .i18n-zh / .i18n-en，由 data-lang 决定显示哪一份。
   点击 .langswitch [data-set-lang] 切换，并把选择写入 localStorage。 */
(function () {
  var KEY = 'dailylang.lang';
  var DEFAULT = 'zh-Hans';
  var SUPPORTED = ['zh-Hans', 'en'];
  var TITLE_ATTR = { 'zh-Hans': 'titleZh', 'en': 'titleEn' };
  var root = document.documentElement;

  function apply(lang) {
    if (SUPPORTED.indexOf(lang) === -1) lang = DEFAULT;
    root.setAttribute('data-lang', lang);
    root.setAttribute('lang', lang);

    // 可选：<html data-title-zh="…" data-title-en="…"> 让标签页标题跟随语言
    var title = root.dataset[TITLE_ATTR[lang]];
    if (title) document.title = title;

    var buttons = document.querySelectorAll('[data-set-lang]');
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].classList.toggle('on', buttons[i].getAttribute('data-set-lang') === lang);
    }
  }

  document.addEventListener('click', function (event) {
    var target = event.target;
    var button = target && target.closest ? target.closest('[data-set-lang]') : null;
    if (!button) return;

    var lang = button.getAttribute('data-set-lang');
    try { localStorage.setItem(KEY, lang); } catch (e) { /* 隐私模式下忽略 */ }
    apply(lang);
  });

  var saved = null;
  try { saved = localStorage.getItem(KEY); } catch (e) { /* 忽略 */ }

  apply(saved || root.getAttribute('data-lang') || DEFAULT);
})();
