(function () {
  var KEY_CITY = 'wx:city';
  var KEY_RECENT = 'wx:recent';
  var KEY_CACHE = 'wx:cache';
  var KEY_FAVORITES = 'wx:favorites';
  var KEY_SETTINGS = 'wx:settings';
  var DEFAULT_CITY = { name: 'Варшава', country: 'Польша', lat: 52.2297, lon: 21.0122 };
  var DEFAULT_SETTINGS = { unit: 'c', windUnit: 'kmh' };
  var RECENT_LIMIT = 6;
  var FAVORITES_LIMIT = 12;

  function read(key) {
    try {
      var value = localStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (e) {
      return null;
    }
  }

  function write(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      return;
    }
  }

  function sameCity(a, b) {
    return !!a && !!b && Math.abs(a.lat - b.lat) < 0.005 && Math.abs(a.lon - b.lon) < 0.005;
  }

  function addUnique(key, city, limit) {
    var list = (read(key) || []).filter(function (item) { return !sameCity(item, city); });
    list.unshift(city);
    write(key, list.slice(0, limit));
  }

  window.Store = {
    sameCity: sameCity,
    getCity: function () { return read(KEY_CITY) || DEFAULT_CITY; },
    setCity: function (city) { write(KEY_CITY, city); },
    getRecent: function () { return read(KEY_RECENT) || []; },
    pushRecent: function (city) { addUnique(KEY_RECENT, city, RECENT_LIMIT); },
    getFavorites: function () { return read(KEY_FAVORITES) || []; },
    isFavorite: function (city) { return Store.getFavorites().some(function (item) { return sameCity(item, city); }); },
    addFavorite: function (city) { addUnique(KEY_FAVORITES, city, FAVORITES_LIMIT); },
    removeFavorite: function (city) { write(KEY_FAVORITES, Store.getFavorites().filter(function (item) { return !sameCity(item, city); })); },
    getCache: function () { return read(KEY_CACHE); },
    setCache: function (city, raw) { write(KEY_CACHE, { city: city, raw: raw, ts: Date.now() }); },
    getSettings: function () {
      var saved = read(KEY_SETTINGS) || {};
      return {
        unit: saved.unit === 'f' ? 'f' : DEFAULT_SETTINGS.unit,
        windUnit: saved.windUnit === 'ms' ? 'ms' : DEFAULT_SETTINGS.windUnit
      };
    },
    setSetting: function (name, value) {
      var settings = Store.getSettings();
      settings[name] = value;
      write(KEY_SETTINGS, settings);
    }
  };
})();
