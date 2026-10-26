(function () {
  var COLOR = '#060a15';

  window.addEventListener('load', function () {
    var tg = window.Telegram && window.Telegram.WebApp;
    if (!tg) return;
    tg.ready();
    tg.expand();
    try {
      tg.setHeaderColor(COLOR);
      tg.setBackgroundColor(COLOR);
    } catch (e) {
      return;
    }
  });
})();
