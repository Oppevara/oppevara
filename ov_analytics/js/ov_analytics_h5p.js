(function ($) {
  Drupal.behaviors.ovAnalytics = {
    attach: function (context, settings) {
      if ( window.H5P )
      {
        var moduleSettings = settings.ovAnalytics;
        H5P.externalDispatcher.on('xAPI', function (event) {
          var data = {
            statement: JSON.stringify(event.data.statement)
          };
          $.post(moduleSettings.endpointUrl, data);
        });
      }
    }
  };
})(jQuery);
