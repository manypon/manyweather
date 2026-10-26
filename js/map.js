(function () {
  var TILE_SIZE = 256;
  var MIN_ZOOM = 3;
  var MAX_ZOOM = 8;
  var page;
  var canvas;
  var city;
  var zoom = 5;
  var frame = 0;
  var frames = [];
  var layer = 'precipitation';
  var offsetX = 0;
  var offsetY = 0;
  var pointer = null;
  var playing = false;
  var timer = null;
  var forecast = null;

  function $(id) { return document.getElementById(id); }

  function project(lat, lon, level) {
    var scale = TILE_SIZE * Math.pow(2, level);
    var sin = Math.max(-0.9999, Math.min(0.9999, Math.sin(lat * Math.PI / 180)));
    return { x: (lon + 180) / 360 * scale, y: (0.5 - Math.log((1 + sin) / (1 - sin)) / (4 * Math.PI)) * scale };
  }

  function baseTileUrl(x, y) {
    var count = Math.pow(2, zoom);
    x = (x % count + count) % count;
    return 'https://tile.openstreetmap.org/' + zoom + '/' + x + '/' + y + '.png';
  }

  function radarTileUrl(path, x, y) {
    var count = Math.pow(2, zoom);
    x = (x % count + count) % count;
    return 'https://tilecache.rainviewer.com' + path + '/256/' + zoom + '/' + x + '/' + y + '/2/1_1.png';
  }

  function drawMap() {
    if (!city || !canvas || !canvas.clientWidth) return;
    var width = canvas.clientWidth;
    var height = canvas.clientHeight;
    var center = project(city.lat, city.lon, zoom);
    var left = center.x - width / 2 + offsetX;
    var top = center.y - height / 2 + offsetY;
    var startX = Math.floor(left / TILE_SIZE);
    var startY = Math.floor(top / TILE_SIZE);
    var endX = Math.floor((left + width) / TILE_SIZE);
    var endY = Math.floor((top + height) / TILE_SIZE);
    var frameData = layer === 'precipitation' && frames.length ? frames[frame] : null;
    var fragment = document.createDocumentFragment();

    for (var y = startY; y <= endY; y += 1) {
      if (y < 0 || y >= Math.pow(2, zoom)) continue;
      for (var x = startX; x <= endX; x += 1) {
        var position = 'left:' + (x * TILE_SIZE - left) + 'px;top:' + (y * TILE_SIZE - top) + 'px';
        var base = document.createElement('img');
        base.className = 'map-raster';
        base.alt = '';
        base.draggable = false;
        base.src = baseTileUrl(x, y);
        base.style.cssText = position;
        fragment.appendChild(base);
        if (frameData) {
          var radar = document.createElement('img');
          radar.className = 'map-raster radar-raster';
          radar.alt = '';
          radar.draggable = false;
          radar.src = radarTileUrl(frameData.path, x, y);
          radar.style.cssText = position;
          fragment.appendChild(radar);
        }
      }
    }

    var pin = document.createElement('span');
    pin.className = 'map-pin';
    pin.style.left = width / 2 + 'px';
    pin.style.top = height / 2 + 'px';
    fragment.appendChild(pin);
    canvas.replaceChildren(fragment);
  }

  function renderForecast() {
    var box = $('mapForecast');
    if (!forecast || !forecast.hourly || !forecast.hourly.precipitation) {
      box.hidden = true;
      return;
    }
    var amount = forecast.hourly.precipitation[0] || 0;
    var probability = forecast.hourly.precipitation_probability[0] || 0;
    box.hidden = layer !== 'forecast';
    box.innerHTML = '<strong>Прогноз для ' + city.name + '</strong><span>Осадки в ближайший час: <b>' + amount.toFixed(1) + ' мм</b></span><span>Вероятность: <b>' + probability + '%</b></span>';
  }

  function loadForecast() {
    var query = new URLSearchParams({ latitude: city.lat, longitude: city.lon, hourly: 'precipitation,precipitation_probability', forecast_hours: 1, timezone: 'auto' });
    fetch('https://api.open-meteo.com/v1/forecast?' + query)
      .then(function (response) { if (!response.ok) throw new Error('Forecast unavailable'); return response.json(); })
      .then(function (data) { forecast = data; renderForecast(); })
      .catch(function () { forecast = null; renderForecast(); });
  }

  function updateStatus() {
    if (layer === 'forecast') {
      $('mapStatus').textContent = 'Прогноз осадков · Open-Meteo';
      renderForecast();
      return;
    }
    $('mapForecast').hidden = true;
    $('mapStatus').textContent = frames.length ? new Date(frames[frame].time * 1000).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) + ' · RainViewer' : 'Нет данных радара для этой области';
  }

  function setLayer(next) {
    layer = next;
    document.querySelectorAll('.map-layer').forEach(function (button) { button.classList.toggle('active', button.getAttribute('data-layer') === next); });
    updateStatus();
    drawMap();
  }

  function loadRadar() {
    fetch('https://api.rainviewer.com/public/weather-maps.json')
      .then(function (response) { if (!response.ok) throw new Error('Radar unavailable'); return response.json(); })
      .then(function (data) { frames = (data.radar && data.radar.past || []).slice(-8); frame = Math.max(0, frames.length - 1); updateStatus(); drawMap(); })
      .catch(function () { frames = []; updateStatus(); drawMap(); });
  }

  function stepFrame() {
    if (!frames.length) return;
    frame = (frame + 1) % frames.length;
    updateStatus();
    drawMap();
  }

  function togglePlayback() {
    if (!frames.length) { setLayer('forecast'); return; }
    playing = !playing;
    $('mapPlay').textContent = playing ? 'Ⅱ' : '▶';
    if (timer) clearInterval(timer);
    timer = playing ? setInterval(stepFrame, 900) : null;
  }

  function open(nextCity) {
    city = nextCity || city || Store.getCity();
    $('mapLocation').textContent = [city.name, city.country].filter(Boolean).join(', ');
    Nav.show('mapPage', 1);
    updateStatus();
    drawMap();
    loadForecast();
    if (!canvas.dataset.ready) { canvas.dataset.ready = '1'; loadRadar(); }
  }

  function updateCity(nextCity) {
    city = nextCity;
    if (!page || !city) return;
    $('mapLocation').textContent = [city.name, city.country].filter(Boolean).join(', ');
    offsetX = 0;
    offsetY = 0;
    loadForecast();
    drawMap();
  }

  function init() {
    page = $('mapPage');
    canvas = $('weatherMap');
    $('mapLocate').innerHTML = Icons.ui('locate', 20);
    Nav.register(1, function () { open(Store.getCity()); });
    $('radar').addEventListener('click', function () { open(Store.getCity()); });
    $('mapLocate').addEventListener('click', function () { offsetX = 0; offsetY = 0; drawMap(); });
    $('mapPlay').addEventListener('click', togglePlayback);
    document.querySelectorAll('.map-layer').forEach(function (button) { button.addEventListener('click', function () { setLayer(button.getAttribute('data-layer')); }); });
    canvas.addEventListener('pointerdown', function (event) { pointer = { x: event.clientX, y: event.clientY, ox: offsetX, oy: offsetY }; canvas.setPointerCapture(event.pointerId); });
    canvas.addEventListener('pointermove', function (event) { if (!pointer) return; offsetX = pointer.ox - (event.clientX - pointer.x); offsetY = pointer.oy - (event.clientY - pointer.y); drawMap(); });
    canvas.addEventListener('pointerup', function () { pointer = null; });
    canvas.addEventListener('pointercancel', function () { pointer = null; });
    canvas.addEventListener('wheel', function (event) { event.preventDefault(); zoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoom + (event.deltaY < 0 ? 1 : -1))); offsetX = 0; offsetY = 0; drawMap(); }, { passive: false });
    window.addEventListener('resize', drawMap);
  }

  window.MapPage = { updateCity: updateCity };
  document.addEventListener('DOMContentLoaded', init);
})();
