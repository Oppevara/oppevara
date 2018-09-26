(function () {
  "use strict";
  if (!window.H5P) {
    return;
  }

  H5P.jQuery('document').ready(function() {
    if (H5P.instances && H5P.instances.length > 0) {
      H5P.jQuery.each(H5P.instances, function(index, instance) {
        var $container = H5P.jQuery('.h5p-content[data-content-id="' + instance.contentId + '"]').get(0);
        var $actions = H5P.jQuery($container).find('.h5p-actions');
        H5P.jQuery('<div/>', {
          class: 'ov-donors-data',
          style: 'font-size: 12px;font-family: Sans-Serif;color: #999;display:table;margin:0.5em;',
          html: '<img src="' + H5PIntegration.baseUrl + '/sites/all/modules/oppevara/images/donors-logo.jpg" alt="donors-logo" style="width:150px;height:80px;display:table-cell;margin-right:1em;"><span style="display:table-cell;vertical-align:top;">Digiõppematerjalid on valminud Euroopa Sotsiaalfondi meetme „Kaasaegse ja uuendusliku õppevara arendamine ja kasutuselevõtt“ raames Haridus- ja Teadusministeeriumi tellimusel.</span>'
        }).insertAfter($actions);
        H5P.jQuery('<div/>', {
          class: 'ov-creative-commons',
          style: 'text-align:center;font-family: Sans-Serif;font-size:12px;',
          html: '<a rel="license" href="http://creativecommons.org/licenses/by/3.0/ee/" target="_blank"><img alt="Creative Commonsi litsents" style="border-width:0" src="https://i.creativecommons.org/l/by/3.0/ee/80x15.png" /></a><br />See teos on antud Creative Commonsi litsentsi "<a rel="license" href="http://creativecommons.org/licenses/by/3.0/ee/" target="_blank">Autorile viitamine 3.0 Eesti</a>" alla.'
        }).insertAfter($actions);
        setTimeout(function() {
          H5P.trigger(instance, 'resize');
        }, 250);
      });
    }
  });
})();
