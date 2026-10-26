(function () {
  var STALE_MS = 10 * 60 * 1000;
  var city = Store.getCity();
  var token = 0;
  var hasData = false;
  var loadedAt = 0;

  function showCached() {
    hasData = false;
    var cache = Store.getCache();
    if (!cache || !Store.sameCity(cache.city, city)) return;
    try {
      UI.renderWeather(Model.build(cache.raw));
      hasData = true;
    } catch (e) {
      hasData = false;
    }
  }

  function load() {
    var mine = ++token;
    UI.setLoading(true);
    Api.forecast(city.lat, city.lon)
      .then(function (raw) {
        if (mine !== token) return;
        var model = Model.build(raw);
        Store.setCache(city, raw);
        UI.renderWeather(model);
        hasData = true;
        loadedAt = Date.now();
        UI.hideToast();
      })
      .catch(function () {
        if (mine !== token) return;
        if (!hasData) UI.renderPlaceholder('Нет данных');
        UI.toast(hasData ? 'Нет связи. Показаны сохранённые данные' : 'Не удалось загрузить погоду', load);
      })
      .finally(function () {
        if (mine === token) UI.setLoading(false);
      });
  }

  function selectCity(next) {
    city = next;
    Store.setCity(city);
    Store.pushRecent(city);
    UI.renderCity(city);
    MapPage.updateCity(city);
    CityLists.updateCity(city);
    UI.hideToast();
    UI.renderPlaceholder('Загрузка…');
    showCached();
    load();
  }

  UI.init();
  Nav.init();
  Nav.register(0, function () { Nav.show('screen', 0); });
  Nav.register(2, CityLists.openHistory);
  Nav.register(3, CityLists.openFavorites);
  Nav.register(4, function () {
    SettingsPage.render();
    Nav.show('morePage', 4);
  });
  UI.renderCity(city);
  UI.renderPlaceholder('Загрузка…');
  showCached();
  Search.init(selectCity);
  CityLists.init(selectCity);
  window.App = { refresh: load };
  SettingsPage.init(selectCity);
  load();

  document.addEventListener('visibilitychange', function () {
    if (document.visibilityState === 'visible' && Date.now() - loadedAt > STALE_MS) load();
  });

})();
