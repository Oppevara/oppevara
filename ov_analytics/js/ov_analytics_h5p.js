(function ($) {
  Drupal.behaviors.ovAnalytics = {
    attach: function (context, settings) {
      if ( window.H5P && window.H5P.externalDispatcher )
      {
        var moduleSettings = settings.ovAnalytics;
        H5P.externalDispatcher.on('xAPI', function (event) {
          $.post(moduleSettings.endpointUrl, {
            statement: JSON.stringify(event.data.statement)
          });
        });
      }
    }
  };
})(jQuery);
