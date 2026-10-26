(function () {
  var TABS = [
    { icon: 'home', label: 'Главная' },
    { icon: 'map', label: 'Карта' },
    { icon: 'clock', label: 'История' },
    { icon: 'star', label: 'Избранное' },
    { icon: 'dots', label: 'Ещё' }
  ];
  var SWAP_MS = 250;
  var TOAST_MS = 4500;

  var currentBg = null;
  var toastTimer = null;
  var unit = 'c';
  var windUnit = 'kmh';
  var lastWeather = null;

  function $(id) {
    return document.getElementById(id);
  }

  function fmt(t) {
    var value = unit === 'f' ? Math.round(t * 9 / 5 + 32) : t;
    return value < 0 ? '\u2212' + Math.abs(value) + '\u00b0' : value + '\u00b0';
  }

  function windText(kmh) {
    if (windUnit === 'ms') return Math.round(kmh / 3.6 * 10) / 10 + ' \u043c/\u0441';
    return kmh + ' \u043a\u043c/\u0447';
  }

  function init() {
    $('pin').innerHTML = Icons.ui('pin', 22);
    $('cityChevron').innerHTML = Icons.ui('chevronDown', 18);
    $('btnSearch').innerHTML = Icons.ui('search', 21);
    $('btnSettings').innerHTML = Icons.ui('gear', 21);
    var more = 'Подробнее' + Icons.ui('chevronRight', 16);
    $('moreDays').innerHTML = more;
    $('moreHours').innerHTML = more;
    $('radarLabel').innerHTML = Icons.ui('map', 22) + '<span>Карта осадков</span><span class="arrow">' + Icons.ui('chevronRight', 18) + '</span>';
    $('nav').innerHTML = TABS.map(function (t, i) {
      return '<button type="button" class="tab' + (i === 0 ? ' active' : '') + '">' + Icons.ui(t.icon, 26) + '<span>' + t.label + '</span></button>';
    }).join('');
  }

  function renderCity(city) {
    $('cityName').textContent = city.name;
    $('country').textContent = city.country || '';
  }

  function setBackground(bg) {
    if (bg === currentBg) return;
    currentBg = bg;
    var img = $('heroImg');
    var src = 'assets/bg/' + bg + '.png';
    if (!img.getAttribute('src')) {
      img.src = src;
      return;
    }
    var next = new Image();
    var apply = function () {
      if (currentBg !== bg) return;
      img.classList.add('is-swap');
      setTimeout(function () {
        img.src = src;
        img.classList.remove('is-swap');
      }, SWAP_MS);
    };
    next.onload = apply;
    next.onerror = apply;
    next.src = src;
  }

  function renderHero(m) {
    setBackground(m.bg);
    $('temp').textContent = fmt(m.temp);
    $('cond').textContent = m.label;
    $('feels').textContent = 'Ощущается как ' + fmt(m.feels);
  }

  function renderStats(m) {
    var items = [
      { icon: 'wind', label: 'Ветер', value: windText(m.wind), extra: m.dir },
      { icon: 'drop', label: 'Влажность', value: m.hum + '%' },
      { icon: 'gauge', label: 'Давление', value: m.press + ' гПа' }
    ];
    $('stats').innerHTML = items.map(function (it) {
      return '<div class="stat">' + Icons.ui(it.icon, 28) +
        '<div class="stat-text"><span class="stat-label">' + it.label + '</span>' +
        '<span class="stat-value">' + it.value + '</span>' +
        (it.extra ? '<span class="stat-dir">' + it.extra + '</span>' : '') +
        '</div></div>';
    }).join('');
  }

  function renderDays(m) {
    $('days').innerHTML = m.days.map(function (d) {
      return '<div class="day' + (d.today ? ' today' : '') + '">' +
        '<span class="day-name">' + d.name + '</span>' +
        Icons.wx(d.kind, 30, false) +
        '<span class="day-hi">' + fmt(d.hi) + '</span>' +
        '<span class="day-lo">' + fmt(d.lo) + '</span></div>';
    }).join('');
  }

  function renderHours(m) {
    $('hours').innerHTML = m.hours.map(function (h) {
      return '<div class="hour' + (h.now ? ' now' : '') + '">' +
        '<span class="hour-time">' + h.time + '</span>' +
        Icons.wx(h.kind, 32, h.night) +
        '<span class="hour-temp">' + fmt(h.temp) + '</span></div>';
    }).join('');
  }

  function renderWeather(m) {
    lastWeather = m;
    renderHero(m);
    renderStats(m);
    renderDays(m);
    renderHours(m);
  }

  function setUnits(nextUnit, nextWindUnit) {
    unit = nextUnit;
    windUnit = nextWindUnit;
    if (lastWeather) renderWeather(lastWeather);
  }

  function renderPlaceholder(label) {
    setBackground(currentBg || 'night-cloudy');
    $('temp').textContent = '\u2013\u00b0';
    $('cond').textContent = label;
    $('feels').textContent = '';
    $('stats').innerHTML = '';
    $('days').innerHTML = '';
    $('hours').innerHTML = '';
  }

  function setLoading(on) {
    $('screen').classList.toggle('is-loading', on);
  }

  function hideToast() {
    clearTimeout(toastTimer);
    $('toast').classList.remove('show');
  }

  function toast(message, onRetry) {
    var el = $('toast');
    var action = $('toastAction');
    $('toastText').textContent = message;
    action.hidden = !onRetry;
    action.onclick = onRetry
      ? function () {
          hideToast();
          onRetry();
        }
      : null;
    el.classList.add('show');
    clearTimeout(toastTimer);
    if (!onRetry) toastTimer = setTimeout(hideToast, TOAST_MS);
  }

  window.UI = {
    init: init,
    renderCity: renderCity,
    renderWeather: renderWeather,
    setUnits: setUnits,
    renderPlaceholder: renderPlaceholder,
    setLoading: setLoading,
    toast: toast,
    hideToast: hideToast
  };
})();
