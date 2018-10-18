(function () {
  if (!window.H5P) {
    return;
  }

  H5P.externalDispatcher.on('xAPI', function (event) {
    var statement = event.data.statement;
    if (!statement.hasOwnProperty('timestamp')) {
      statement.timestamp = (new Date()).toISOString();
    }
    // Drupal JS context is fully unavailable, code relies solely on H5P capabilities
    H5P.jQuery.post(H5PIntegration.baseUrl + '/ajax/ov_analytics/xapi', {
      statement: JSON.stringify(statement)
    });
  });
})();
