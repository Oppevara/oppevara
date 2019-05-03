(function ($) {
    if (!!window.Drupal) {
        return;
    }

    var $base = $("base");
    if($base.length > 0){
        $base.attr("target", "_blank");
    } else {
        $("head").prepend("<base target='_blank'>");
    }
})(H5P.jQuery);
