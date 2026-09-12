// Inject the Sarcio reporter widget with runtime config (from /config.js),
// since the widget reads its settings off its own <script> tag. Pages may set
// window.__SARCIO_WIDGET_ACCENT[_DARK] before this script to theme the widget
// to their own brand.
(function () {
  var s = document.createElement('script');
  s.src = window.__SARCIO_WIDGET_SRC;
  s.setAttribute('data-sarcio-key', window.__SARCIO_SITE_KEY);
  s.setAttribute('data-sarcio-api', window.__SARCIO_API_BASE);
  if (window.__SARCIO_WIDGET_ACCENT) {
    s.setAttribute('data-sarcio-accent', window.__SARCIO_WIDGET_ACCENT);
  }
  if (window.__SARCIO_WIDGET_ACCENT_DARK) {
    s.setAttribute('data-sarcio-accent-dark', window.__SARCIO_WIDGET_ACCENT_DARK);
  }
  if (window.__SARCIO_WIDGET_ICON_PATH) {
    s.setAttribute('data-sarcio-icon-path', window.__SARCIO_WIDGET_ICON_PATH);
  }
  s.defer = true;
  document.body.appendChild(s);
})();
