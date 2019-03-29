(function ($) {

    $(document).ready(function() {

        // Applies a bit of random rotation to each H5P column content element
        function rotateElements() {
            $('.h5p-column-content').each(function () {
                var r = -3 + (Math.random() * (6)); // -3 to +3 deg
                $(this).css('transform', 'rotate(' + r + 'deg');
            });
        }
        rotateElements();

        // Small greeting button at the end of column
        $('.h5p-actions').append('<li class="h5p-button h5p-noselect" id="ovAprilFoolsMessage" style="float: right;" role="button" tabindex="0" title="Vajuta, kui julged!">Aprill!</li>');

        $('#ovAprilFoolsMessage').click(function () {
            rotateElements();
        })
    });

})(H5P.jQuery);

