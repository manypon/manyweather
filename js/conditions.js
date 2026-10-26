(function () {
  var LABELS = {
    0: 'Ясно',
    1: 'Преимущественно ясно',
    2: 'Переменная облачность',
    3: 'Пасмурно',
    45: 'Туман',
    48: 'Изморозь',
    51: 'Лёгкая морось',
    53: 'Морось',
    55: 'Сильная морось',
    56: 'Ледяная морось',
    57: 'Сильная ледяная морось',
    61: 'Небольшой дождь',
    63: 'Дождь',
    65: 'Сильный дождь',
    66: 'Ледяной дождь',
    67: 'Сильный ледяной дождь',
    71: 'Небольшой снег',
    73: 'Снег',
    75: 'Сильный снег',
    77: 'Снежная крупа',
    80: 'Небольшие ливни',
    81: 'Ливни',
    82: 'Сильные ливни',
    85: 'Небольшой снегопад',
    86: 'Сильный снегопад',
    95: 'Гроза',
    96: 'Гроза с градом',
    99: 'Гроза с сильным градом'
  };

  function group(code) {
    if (code === 0 || code === 1) return 'clear';
    if (code === 2) return 'partly';
    if (code === 3) return 'overcast';
    if (code === 45 || code === 48) return 'fog';
    if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) return 'rain';
    if ((code >= 71 && code <= 77) || code === 85 || code === 86) return 'snow';
    if (code >= 95) return 'storm';
    return 'overcast';
  }

  var KINDS = {
    clear: 'sun',
    partly: 'partly',
    overcast: 'cloud',
    fog: 'fog',
    rain: 'rain',
    snow: 'snow',
    storm: 'storm'
  };

  function describe(code) {
    return {
      label: LABELS[code] || 'Облачно',
      kind: KINDS[group(code)]
    };
  }

  function isWet(code) {
    var g = group(code);
    return g === 'rain' || g === 'storm';
  }

  function pickBackground(ctx) {
    var g = group(ctx.code);
    if (g === 'storm') return 'storm';
    if (g === 'snow') return 'snow';
    if (g === 'rain') return 'rain';
    if (g === 'fog') return 'fog';
    if (ctx.windSpeed >= 35) return 'wind';
    var open = g === 'clear' || g === 'partly';
    if (open && ctx.isDay && ctx.recentWet) return 'rainbow';
    if (open && ctx.nearSunset) return 'sunset';
    if (open && ctx.nearSunrise) return 'dawn';
    if (!ctx.isDay) return open && g === 'clear' ? 'night' : 'night-cloudy';
    if (g === 'clear') return 'clear';
    if (g === 'partly') return 'cloudy';
    return 'wind';
  }

  window.Conditions = {
    describe: describe,
    isWet: isWet,
    pickBackground: pickBackground
  };
})();
