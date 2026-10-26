(function () {
  var DEBOUNCE_MS = 300;
  var MIN_CHARS = 2;
  var sheet;
  var input;
  var list;
  var title;
  var note;
  var timer = null;
  var ctrl = null;
  var items = [];
  var onPick = null;

  function $(id) { return document.getElementById(id); }

  function esc(str) {
    return String(str).replace(/[&<>"']/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
  }

  function subline(city) {
    return [city.region, city.country].filter(Boolean).join(', ');
  }

  function setNote(text) {
    note.textContent = text;
    note.hidden = !text;
  }

  function draw(heading, cities, icon) {
    items = cities;
    title.textContent = heading;
    title.hidden = !heading || !cities.length;
    list.innerHTML = cities.map(function (city, index) {
      return '<li><button type="button" class="result" data-i="' + index + '">' + Icons.ui(icon, 20) +
        '<span class="result-text"><span class="result-name">' + esc(city.name) + '</span>' +
        '<span class="result-sub">' + esc(subline(city)) + '</span></span></button></li>';
    }).join('');
  }

  function showRecent() {
    setNote('');
    draw('Недавние', Store.getRecent(), 'clock');
  }

  function pick(city) {
    Store.pushRecent(city);
    close();
    onPick(city);
  }

  function open() {
    sheet.classList.add('open');
    sheet.setAttribute('aria-hidden', 'false');
    input.value = '';
    showRecent();
    setTimeout(function () { input.focus(); }, 150);
  }

  function close() {
    clearTimeout(timer);
    if (ctrl) ctrl.abort();
    ctrl = null;
    sheet.classList.remove('open');
    sheet.setAttribute('aria-hidden', 'true');
    input.blur();
  }

  function run(query) {
    if (ctrl) ctrl.abort();
    var mine = new AbortController();
    ctrl = mine;
    setNote('Поиск…');
    Api.geocode(query, mine.signal)
      .then(function (results) {
        if (mine !== ctrl) return;
        if (!results.length) {
          draw('', [], 'pin');
          setNote('Ничего не найдено');
          return;
        }
        setNote('');
        draw('', results, 'pin');
      })
      .catch(function () {
        if (mine !== ctrl) return;
        draw('', [], 'pin');
        setNote('Не удалось выполнить поиск. Проверь соединение');
      });
  }

  function locateCity() {
    return new Promise(function (resolve, reject) {
      if (!navigator.geolocation) {
        reject(new Error('Геолокация недоступна на этом устройстве'));
        return;
      }
      navigator.geolocation.getCurrentPosition(function (pos) {
        var lat = Math.round(pos.coords.latitude * 10000) / 10000;
        var lon = Math.round(pos.coords.longitude * 10000) / 10000;
        Api.reverse(lat, lon)
          .then(function (place) { resolve({ name: place.name, country: place.country, lat: lat, lon: lon }); })
          .catch(function () { resolve({ name: 'Моё местоположение', country: '', lat: lat, lon: lon }); });
      }, function () {
        reject(new Error('Не удалось получить местоположение. Проверь разрешение на геолокацию'));
      }, { timeout: 10000, maximumAge: 600000 });
    });
  }

  function locate() {
    setNote('Определяем местоположение…');
    locateCity()
      .then(function (city) { pick(city); })
      .catch(function (error) { setNote(error.message); });
  }

  function init(callback) {
    onPick = callback;
    sheet = $('sheet');
    input = $('q');
    list = $('results');
    title = $('resultsTitle');
    note = $('sheetNote');
    $('sheetBack').innerHTML = Icons.ui('back', 22);
    $('locateIcon').innerHTML = Icons.ui('locate', 22);
    $('sheetBack').addEventListener('click', close);
    $('btnLocate').addEventListener('click', locate);
    $('btnSearch').addEventListener('click', open);
    $('btnCity').addEventListener('click', open);

    input.addEventListener('input', function () {
      clearTimeout(timer);
      var query = input.value.trim();
      if (query.length < MIN_CHARS) {
        if (ctrl) ctrl.abort();
        ctrl = null;
        showRecent();
        return;
      }
      timer = setTimeout(function () { run(query); }, DEBOUNCE_MS);
    });

    list.addEventListener('click', function (event) {
      var button = event.target.closest('.result');
      if (!button) return;
      var city = items[Number(button.getAttribute('data-i'))];
      if (city) pick({ name: city.name, region: city.region || '', country: city.country, lat: city.lat, lon: city.lon });
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && sheet.classList.contains('open')) close();
    });
  }

  window.Search = { init: init, locateCity: locateCity };
})();
