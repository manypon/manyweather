(function () {
  var COMPASS = ['С', 'СВ', 'В', 'ЮВ', 'Ю', 'ЮЗ', 'З', 'СЗ'];
  var DAY_NAMES = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
  var SUN_WINDOW_MIN = 50;
  var HOUR_STEP = 3;
  var HOUR_COUNT = 5;

  function compass(deg) { return COMPASS[Math.round(deg / 45) % 8]; }
  function minutes(str) { return Date.parse(str) / 60000; }
  function dayName(dateStr) {
    var p = dateStr.split('-');
    return DAY_NAMES[new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2])).getDay()];
  }
  function hourIndex(hourly, currentTime) {
    var key = currentTime.slice(0, 13);
    var idx = hourly.time.findIndex(function (time) { return time.slice(0, 13) === key; });
    return idx < 0 ? 0 : idx;
  }

  function build(raw) {
    var c = raw.current;
    var h = raw.hourly;
    var d = raw.daily;
    var isDay = c.is_day === 1;
    var idx = hourIndex(h, c.time);
    var now = minutes(c.time);
    var recentWet = h.weather_code.slice(Math.max(0, idx - 3), idx).some(Conditions.isWet);
    var windSpeed = Math.round(c.wind_speed_10m);
    var info = Conditions.describe(c.weather_code);
    var bg = Conditions.pickBackground({
      code: c.weather_code,
      isDay: isDay,
      windSpeed: windSpeed,
      recentWet: recentWet,
      nearSunrise: Math.abs(now - minutes(d.sunrise[0])) <= SUN_WINDOW_MIN,
      nearSunset: Math.abs(now - minutes(d.sunset[0])) <= SUN_WINDOW_MIN
    });
    var hours = [];
    for (var i = 0; i < HOUR_COUNT; i += 1) {
      var j = idx + 1 + i * HOUR_STEP;
      if (j >= h.time.length) break;
      hours.push({ time: h.time[j].slice(11, 16), kind: Conditions.describe(h.weather_code[j]).kind, night: h.is_day[j] === 0, temp: Math.round(h.temperature_2m[j]), now: i === 0 });
    }
    var days = d.time.map(function (date, k) {
      return { name: k === 0 ? 'Сегодня' : dayName(date), kind: Conditions.describe(d.weather_code[k]).kind, hi: Math.round(d.temperature_2m_max[k]), lo: Math.round(d.temperature_2m_min[k]), today: k === 0 };
    });
    return {
      temp: Math.round(c.temperature_2m), feels: Math.round(c.apparent_temperature),
      label: bg === 'rainbow' ? 'После дождя' : info.label, bg: bg,
      wind: windSpeed, dir: compass(c.wind_direction_10m), hum: Math.round(c.relative_humidity_2m),
      press: Math.round(c.pressure_msl), hours: hours, days: days
    };
  }

  window.Model = { build: build };
})();
