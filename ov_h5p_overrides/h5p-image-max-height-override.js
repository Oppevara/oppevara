(function ($) {

    var h5pImgSelector = '.h5p-column-content.h5p-image > img';
    var previousHeight = 0;

    $('head').append('<style id="h5pImageMaxDimensions" type="text/css">' + h5pImgSelector + ' {max-height: 100%; max-width: 100%;}</style>');

    setMaxDimensions();
    function setMaxDimensions(){
        var vh = window.top.innerHeight - 50; // height of the parent frame (viewport) minus a little padding for possible menus etc.
        var vw = window.innerWidth; // width of the iframe iself

        if(vh-previousHeight > 100){ // for iOS and browers jumping menu bars
            $('#h5pImageMaxDimensions').text(h5pImgSelector + ' {max-height: ' + vh + 'px; max-width: ' + vw +'px; }');
            previousHeight = vh;
        }
    }

    var resizeTimer;
    $(window).resize(function() {
        // timeout to debounce resizing, so it won't fire too often WHILE resizing
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            setMaxDimensions();
            //H5P.trigger(H5P.instances[0], 'resize');
        }, 100);
    });
})(H5P.jQuery);
