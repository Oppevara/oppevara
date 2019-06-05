(function ($) {
  H5P.CoursePresentation.prototype.ovShowInteractionPopup = H5P.CoursePresentation.prototype.showInteractionPopup;
  // TODO We would ideally need to automaticlly extract the argument signature from the correct method and create a function with that
  H5P.CoursePresentation.prototype.showInteractionPopup = function(instance, $button, $buttonElement, libTypePmz, autoPlay, closeCallback, popupPosition) {
    H5P.CoursePresentation.prototype.ovShowInteractionPopup.apply(this, arguments);

    if (!this.isEditor()) {
      var $container = $buttonElement.closest('.h5p-popup-container');

      if ($container.parents('.h5p-interactivevideo').length > 0) {
        $container.off('transitionend');
      }

      /*
      // Disable any previous events (should be the one registered by the previous method)
      $container.off('transitionend');
      // Focus directly on content when popup is opened
      $container.on('transitionend', function () {
        // Custom code that prevents refocuse in case of Interactive Video
        if ($buttonElement.parents('.h5p-interactivevideo').length > 0) {
          return;
        }

        var $tabbables = $buttonElement.find(':input').add($buttonElement.find('[tabindex]'));
        if ($tabbables.length) {
          $tabbables[0].focus();
        }
        else {
          $buttonElement.attr('tabindex', 0);
          $buttonElement.focus();
        }
      });
      */
    }
  };
})(H5P.jQuery);
