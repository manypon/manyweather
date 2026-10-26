(function () {
  var currentCity;
  var selectCity;

  function $(id) { return document.getElementById(id); }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (character) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character];
    });
  }

  function renderList(targetId, cities, emptyText, removable) {
    var target = $(targetId);
    if (!cities.length) {
      target.innerHTML = '<div class="city-empty">' + emptyText + '</div>';
      return;
    }
    target.innerHTML = cities.map(function (city, index) {
      return '<div class="city-row"><button class="city-row-main" type="button" data-open="' + index + '"><span class="city-row-name">' + escapeHtml(city.name) + '</span><span class="city-row-country">' + escapeHtml(city.country || city.region || 'Погода по городу') + '</span></button><button class="city-row-open" type="button" data-open="' + index + '" aria-label="Открыть город">›</button>' + (removable ? '<button class="city-row-remove" type="button" data-remove="' + index + '" aria-label="Убрать из избранного">×</button>' : '') + '</div>';
    }).join('');
    target.onclick = function (event) {
      var openButton = event.target.closest('[data-open]');
      if (openButton) {
        selectCity(cities[Number(openButton.getAttribute('data-open'))]);
        Nav.show('screen', 0);
        return;
      }
      var removeButton = event.target.closest('[data-remove]');
      if (removeButton) {
        Store.removeFavorite(cities[Number(removeButton.getAttribute('data-remove'))]);
        renderFavorites();
      }
    };
  }

  function renderHistory() {
    renderList('historyList', Store.getRecent(), 'Города, которые вы выбираете через поиск, появятся здесь.', false);
  }

  function renderFavorites() {
    renderList('favoritesList', Store.getFavorites(), 'Добавьте текущий город, чтобы быстро возвращаться к его прогнозу.', true);
    var button = $('addFavorite');
    var exists = Store.isFavorite(currentCity);
    button.disabled = exists;
    button.textContent = exists ? '✓ Уже в избранном' : '+ Текущий город';
  }

  function openHistory() {
    renderHistory();
    Nav.show('historyPage', 2);
  }

  function openFavorites() {
    renderFavorites();
    Nav.show('favoritesPage', 3);
  }

  function init(onSelectCity) {
    selectCity = onSelectCity;
    currentCity = Store.getCity();
    $('addFavorite').addEventListener('click', function () {
      if (Store.isFavorite(currentCity)) return;
      Store.addFavorite(currentCity);
      renderFavorites();
      UI.toast('Город добавлен в избранное');
    });
  }

  function updateCity(city) {
    currentCity = city;
    if (!$('favoritesPage').hidden) renderFavorites();
    if (!$('historyPage').hidden) renderHistory();
  }

  window.CityLists = { init: init, updateCity: updateCity, openHistory: openHistory, openFavorites: openFavorites };
})();
