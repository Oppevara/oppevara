(function () {
  if (!window.H5P) {
    return;
  }

  H5P.externalDispatcher.on('xAPI', function (event) {
    var data = {
      statement: JSON.stringify(event.data.statement)
    };
    // Drupal JS context is fully unavailable, code relies solely on H5P capabilities
    H5P.jQuery.post(H5PIntegration.baseUrl + '/ajax/ov_analytics/xapi', data);
  });
})();
