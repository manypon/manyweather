(function () {
  function $(id) { return document.getElementById(id); }

  function paint(containerId, attribute, value) {
    document.querySelectorAll('#' + containerId + ' button').forEach(function (button) {
      button.classList.toggle('active', button.getAttribute(attribute) === value);
    });
  }

  function render() {
    var settings = Store.getSettings();
    paint('temperatureUnit', 'data-unit', settings.unit);
    paint('windUnit', 'data-wind', settings.windUnit);
  }

  function applySettings() {
    var settings = Store.getSettings();
    UI.setUnits(settings.unit, settings.windUnit);
  }

  function init(onSelectCity) {
    document.querySelectorAll('#temperatureUnit button').forEach(function (button) {
      button.addEventListener('click', function () {
        Store.setSetting('unit', button.getAttribute('data-unit'));
        render();
        applySettings();
      });
    });
    document.querySelectorAll('#windUnit button').forEach(function (button) {
      button.addEventListener('click', function () {
        Store.setSetting('windUnit', button.getAttribute('data-wind'));
        render();
        applySettings();
      });
    });
    $('settingsLocation').addEventListener('click', function () {
      UI.toast('Определяем местоположение…');
      Search.locateCity()
        .then(function (city) {
          onSelectCity(city);
          Nav.show('screen', 0);
          UI.toast('Город определён: ' + city.name);
        })
        .catch(function (error) { UI.toast(error.message); });
    });
    $('settingsRefresh').addEventListener('click', App.refresh);
    render();
    applySettings();
  }

  window.SettingsPage = { init: init, render: render };
})();
