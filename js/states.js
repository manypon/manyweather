window.STATES = {
  night:         { bg: 'night',        label: 'Ясно',                 kind: 'sun',    temp: 11, feels: 9,  wind: 8,  dir: 'С',  hum: 58, press: 1021 },
  'night-cloudy':{ bg: 'night-cloudy', label: 'Пасмурно',             kind: 'cloud',  temp: 16, feels: 14, wind: 12, dir: 'СЗ', hum: 68, press: 1013 },
  clear:         { bg: 'clear',        label: 'Ясно',                 kind: 'sun',    temp: 21, feels: 20, wind: 9,  dir: 'Ю',  hum: 41, press: 1022 },
  cloudy:        { bg: 'cloudy',       label: 'Переменная облачность', kind: 'partly', temp: 18, feels: 17, wind: 14, dir: 'З',  hum: 55, press: 1015 },
  rain:          { bg: 'rain',         label: 'Дождь',                kind: 'rain',   temp: 12, feels: 10, wind: 18, dir: 'ЮЗ', hum: 86, press: 1004 },
  storm:         { bg: 'storm',        label: 'Гроза',                kind: 'storm',  temp: 19, feels: 20, wind: 24, dir: 'З',  hum: 82, press: 998 },
  snow:          { bg: 'snow',         label: 'Снег',                 kind: 'snow',   temp: -2, feels: -6, wind: 9,  dir: 'СВ', hum: 90, press: 1019 },
  fog:           { bg: 'fog',          label: 'Туман',                kind: 'fog',    temp: 7,  feels: 6,  wind: 3,  dir: 'В',  hum: 97, press: 1016 },
  sunset:        { bg: 'sunset',       label: 'Ясно',                 kind: 'sun',    temp: 20, feels: 19, wind: 7,  dir: 'З',  hum: 47, press: 1018 },
  dawn:          { bg: 'dawn',         label: 'Ясно',                 kind: 'sun',    temp: 9,  feels: 7,  wind: 5,  dir: 'В',  hum: 72, press: 1020 },
  wind:          { bg: 'wind',         label: 'Сильный ветер',        kind: 'windy',  temp: 14, feels: 10, wind: 38, dir: 'СЗ', hum: 55, press: 1009 },
  rainbow:       { bg: 'rainbow',      label: 'После дождя',          kind: 'partly', temp: 15, feels: 14, wind: 11, dir: 'ЮЗ', hum: 78, press: 1010 }
};

window.CITY = { name: 'Варшава', country: 'Польша' };
