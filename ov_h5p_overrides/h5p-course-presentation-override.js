(function ($) {
  H5P.CoursePresentation.prototype.ovShowInteractionPopup = H5P.CoursePresentation.prototype.showInteractionPopup;
  H5P.CoursePresentation.prototype.showInteractionPopup = function() {

    // This function actually gets the same arguments as the real function!
    H5P.CoursePresentation.prototype.ovShowInteractionPopup.apply(this, arguments);

    if (!this.isEditor()) {
      var $container = arguments[2].closest('.h5p-popup-container');

      if ($container.parents('.h5p-interactivevideo').length > 0) {
        $container.off('transitionend');
      }
    }
  };
})(H5P.jQuery);
