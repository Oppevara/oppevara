(function ($) {
  Drupal.behaviors.ovAnalytics = {
    attach: function (context, settings) {
      if ( window.H5P && window.H5P.externalDispatcher )
      {
        var moduleSettings = settings.ovAnalytics;
        H5P.externalDispatcher.on('xAPI', function (event) {
          var statement = event.data.statement;
          if (!statement.hasOwnProperty('timestamp')) {
            statement.timestamp = (new Date()).toISOString();
          }
          $.post(moduleSettings.endpointUrl, {
            statement: JSON.stringify(statement)
          });
        });
      }
    }
  };
})(jQuery);
