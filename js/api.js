(function () {
  var FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
  var GEOCODE_URL = 'https://geocoding-api.open-meteo.com/v1/search';
  var REVERSE_URL = 'https://api.bigdatacloud.net/data/reverse-geocode-client';
  var TIMEOUT = 10000;

  function getJSON(url, signal) {
    var ctrl = new AbortController();
    var timer = setTimeout(function () {
      ctrl.abort();
    }, TIMEOUT);
    if (signal) {
      if (signal.aborted) ctrl.abort();
      signal.addEventListener('abort', function () {
        ctrl.abort();
      });
    }
    return fetch(url, { signal: ctrl.signal })
      .then(function (res) {
        if (!res.ok) throw new Error('http ' + res.status);
        return res.json();
      })
      .finally(function () {
        clearTimeout(timer);
      });
  }

  function query(params) {
    return new URLSearchParams(params).toString();
  }

  window.Api = {
    forecast: function (lat, lon) {
      var q = query({
        latitude: lat,
        longitude: lon,
        current: 'temperature_2m,apparent_temperature,relative_humidity_2m,pressure_msl,wind_speed_10m,wind_direction_10m,weather_code,is_day',
        hourly: 'temperature_2m,weather_code,is_day',
        daily: 'weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset',
        wind_speed_unit: 'kmh',
        timezone: 'auto',
        forecast_days: 7,
        past_hours: 3,
        forecast_hours: 24
      });
      return getJSON(FORECAST_URL + '?' + q);
    },
    geocode: function (name, signal) {
      var q = query({ name: name, count: 8, language: 'ru', format: 'json' });
      return getJSON(GEOCODE_URL + '?' + q, signal).then(function (data) {
        return (data.results || []).map(function (r) {
          return {
            name: r.name,
            region: r.admin1 || '',
            country: r.country || '',
            lat: r.latitude,
            lon: r.longitude
          };
        });
      });
    },
    reverse: function (lat, lon) {
      var q = query({ latitude: lat, longitude: lon, localityLanguage: 'ru' });
      return getJSON(REVERSE_URL + '?' + q).then(function (data) {
        var name = data.city || data.locality || data.principalSubdivision;
        if (!name) throw new Error('no place');
        return { name: name, country: data.countryName || '' };
      });
    }
  };
})();
