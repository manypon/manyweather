(function () {
  var PAGES = ['screen', 'mapPage', 'historyPage', 'favoritesPage', 'morePage'];
  var handlers = {};

  function $(id) { return document.getElementById(id); }

  function show(pageId, tabIndex) {
    PAGES.forEach(function (id) {
      var page = $(id);
      if (page) page.hidden = id !== pageId;
    });
    document.querySelectorAll('.tab').forEach(function (tab, index) {
      tab.classList.toggle('active', index === tabIndex);
    });
  }

  function register(tabIndex, handler) {
    handlers[tabIndex] = handler;
  }

  function init() {
    document.querySelectorAll('.tab').forEach(function (tab, index) {
      tab.addEventListener('click', function (event) {
        event.preventDefault();
        var handler = handlers[index];
        if (handler) {
          handler();
          return;
        }
        show(PAGES[index], index);
      });
    });
  }

  window.Nav = { show: show, register: register, init: init };
})();
