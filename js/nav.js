(function () {
  var PAGES = ['screen', 'mapPage', 'historyPage', 'favoritesPage', 'morePage'];
  var handlers = {};
  var activeIndex = 0;
  var touchStart = null;

  function $(id) { return document.getElementById(id); }

  function show(pageId, tabIndex) {
    PAGES.forEach(function (id) {
      var page = $(id);
      if (page) page.hidden = id !== pageId;
    });
    document.querySelectorAll('.tab').forEach(function (tab, index) {
      tab.classList.toggle('active', index === tabIndex);
    });
    activeIndex = tabIndex;
  }

  function navigate(index) {
    if (index < 0 || index >= PAGES.length || index === activeIndex) return;
    var handler = handlers[index];
    if (handler) {
      handler();
      return;
    }
    show(PAGES[index], index);
  }

  function register(tabIndex, handler) {
    handlers[tabIndex] = handler;
  }

  function init() {
    document.querySelectorAll('.tab').forEach(function (tab, index) {
      tab.addEventListener('click', function (event) {
        event.preventDefault();
        navigate(index);
      });
    });
    document.addEventListener('touchstart', function (event) {
      if (event.touches.length !== 1 || event.target.closest('.map-canvas, .sheet, .nav')) return;
      var page = $(PAGES[activeIndex]);
      touchStart = { x: event.touches[0].clientX, y: event.touches[0].clientY, scrollTop: page ? page.scrollTop : 0 };
    }, { passive: true });
    document.addEventListener('touchend', function (event) {
      if (!touchStart || event.changedTouches.length !== 1) return;
      var dx = event.changedTouches[0].clientX - touchStart.x;
      var dy = event.changedTouches[0].clientY - touchStart.y;
      var page = $(PAGES[activeIndex]);
      var scrollTop = page ? page.scrollTop : 0;
      if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.25 && Math.abs(scrollTop - touchStart.scrollTop) < 4) {
        navigate(activeIndex + (dx < 0 ? 1 : -1));
      }
      touchStart = null;
    }, { passive: true });
    document.addEventListener('touchcancel', function () { touchStart = null; }, { passive: true });
  }

  window.Nav = { show: show, register: register, init: init };
})();
