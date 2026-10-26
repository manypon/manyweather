(function () {
  var UI = {
    pin: '<path d="M12 21s7-6.2 7-11.5a7 7 0 0 0-14 0C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.6"/>',
    chevronDown: '<path d="M6 9l6 6 6-6"/>',
    chevronRight: '<path d="M9 6l6 6-6 6"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/>',
    gear: '<circle cx="12" cy="12" r="3.2"/><path d="M19.4 13.5l1.6 1.2-1.6 2.8-1.9-.6a7 7 0 0 1-1.6 1l-.4 2h-3.2l-.4-2a7 7 0 0 1-1.6-1l-1.9.6-1.6-2.8 1.6-1.2a7 7 0 0 1 0-1.9L4.8 10.4l1.6-2.8 1.9.6a7 7 0 0 1 1.6-1l.4-2h3.2l.4 2a7 7 0 0 1 1.6 1l1.9-.6 1.6 2.8-1.6 1.2a7 7 0 0 1 0 1.9z"/>',
    wind: '<path d="M3 9h11a2.5 2.5 0 1 0-2.5-2.5M3 13h15a2.5 2.5 0 1 1-2.5 2.5M3 17h7"/>',
    drop: '<path d="M12 3.5c3.5 4.2 6 7.2 6 10.3a6 6 0 0 1-12 0c0-3.1 2.5-6.1 6-10.3z"/>',
    gauge: '<circle cx="12" cy="13" r="8"/><path d="M12 13V8.5M10 3h4"/><circle cx="12" cy="13" r="1.3"/>',
    map: '<path d="M3 6.5l6-2.5 6 2.5 6-2.5v13.5l-6 2.5-6-2.5-6 2.5z"/><path d="M9 4v13.5M15 6.5V20"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    star: '<path d="M12 3.5l2.6 5.3 5.9.9-4.25 4.1 1 5.8L12 16.9 6.75 19.6l1-5.8L3.5 9.7l5.9-.9z"/>',
    dots: '<circle cx="5" cy="12" r="1.6" fill="currentColor"/><circle cx="12" cy="12" r="1.6" fill="currentColor"/><circle cx="19" cy="12" r="1.6" fill="currentColor"/>',
    back: '<path d="M15 6l-6 6 6 6"/>',
    locate: '<circle cx="12" cy="12" r="3.5"/><circle cx="12" cy="12" r="8"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/>',
    home: '<path d="M4 11l8-7 8 7v8.5a1 1 0 0 1-1 1h-4.5v-6h-5v6H5a1 1 0 0 1-1-1z" fill="currentColor"/>'
  };

  var CLOUD = '<path d="M13 36h21a8.5 8.5 0 0 0 1.2-16.9A11.5 11.5 0 0 0 13.4 21.4 7.3 7.3 0 0 0 13 36z" fill="url(#gCloud)"/>';
  var SUN = '<g stroke="#ffc933" stroke-width="2.6" stroke-linecap="round"><path d="M24 4v5M24 39v5M4 24h5M39 24h5M9.9 9.9l3.5 3.5M34.6 34.6l3.5 3.5M9.9 38.1l3.5-3.5M34.6 13.4l3.5-3.5"/></g><circle cx="24" cy="24" r="9.5" fill="url(#gSun)"/>';
  var MOON = '<path d="M31 7a17 17 0 1 0 11 29 14 14 0 0 1-11-29z" fill="url(#gMoon)"/>';

  var WX = {
    sun: SUN,
    moon: MOON,
    cloud: '<g transform="translate(0 2)">' + CLOUD + '</g>',
    partly: '<g transform="translate(2 -1) scale(.62)">' + SUN + '</g><g transform="translate(4 4)">' + CLOUD + '</g>',
    moonCloud: '<g transform="translate(14 -2) scale(.72)">' + MOON + '</g><g transform="translate(0 4)">' + CLOUD + '</g>',
    rain: '<g transform="translate(0 -6)">' + CLOUD + '</g><path d="M17 34l-2 6M25 34l-2 6M33 34l-2 6M21 41l-1.5 5M29 41l-1.5 5" stroke="#4fb3ff" stroke-width="2.4" stroke-linecap="round"/>',
    storm: '<g transform="translate(0 -6)">' + CLOUD + '</g><path d="M25 29l-6 9h5l-2 8 8-11h-5z" fill="#ffd23f"/>',
    snow: '<g transform="translate(0 -6)">' + CLOUD + '</g><g fill="#dfe9ff"><circle cx="17" cy="36" r="2.2"/><circle cx="25" cy="41" r="2.2"/><circle cx="33" cy="36" r="2.2"/><circle cx="21" cy="46" r="1.8"/><circle cx="29" cy="46" r="1.8"/></g>',
    fog: '<g transform="translate(0 -8)">' + CLOUD + '</g><path d="M12 32h24M16 38h20M12 44h24" stroke="#9fb0de" stroke-width="2.6" stroke-linecap="round"/>',
    windy: '<g fill="none" stroke="#b9c6ee" stroke-width="2.8" stroke-linecap="round"><path d="M6 18h22a5 5 0 1 0-5-5M6 26h30a5 5 0 1 1-5 5M6 34h16"/></g>'
  };

  window.Icons = {
    ui: function (name, size) {
      var s = size || 22;
      return '<svg class="ico" viewBox="0 0 24 24" width="' + s + '" height="' + s + '" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + UI[name] + '</svg>';
    },
    wx: function (kind, size, night) {
      var k = kind;
      if (night && kind === 'sun') k = 'moon';
      if (night && kind === 'partly') k = 'moonCloud';
      var s = size || 40;
      return '<svg class="ico" viewBox="0 0 48 48" width="' + s + '" height="' + s + '" aria-hidden="true">' + WX[k] + '</svg>';
    }
  };
})();
