(function ($) {
    /**
     * Default font size
     *
     * @constant
     * @type {number}
     * @default
     */
    var DEFAULT_FONT_SIZE = 24;

    /**
     * Handle resizing
     * @private
     * @param {Event} [e]
     * @param {boolean} [e.forceImageHeight]
     * @param {boolean} [e.decreaseSize]
     */
    H5P.ImageHotspots.prototype.resize = function (e) {
        if (this.options.image === null) {
            return;
        }

        var self = this;
        var containerWidth = self.$container.width();
        var containerHeight = self.$container.height();
        var width = containerWidth;
        var height = Math.floor((width/self.options.image.width)*self.options.image.height);
        var forceImageHeight = e && e.data && e.data.forceImageHeight;

        // Check if decreasing iframe size
        var decreaseSize = e && e.data && e.data.decreaseSize;
        if (!decreaseSize) {
            self.$container.css('width', '');
        }

        // If fullscreen, we have both a max width and max height.
        if (!forceImageHeight && H5P.isFullscreen && height > containerHeight) {
            height = containerHeight;
            width = Math.floor((height/self.options.image.height)*self.options.image.width);
        }

        // Check if we need to apply semi full screen fix.
        if (self.$container.is('.h5p-semi-fullscreen')) {

            // Reset semi fullscreen width
            self.$container.css('width', '');

            // Decrease iframe size
            if (!decreaseSize) {
                self.$hotspotContainer.css('width', '10px');
                self.$image.css('width', '10px');

                // Trigger changes
                setTimeout(function () {
                    self.trigger('resize', {decreaseSize: true});
                }, 200);
            }

            // Set width equal to iframe parent width, since iframe content has not been updated yet.
            var $iframe = $(window.frameElement);
            if ($iframe) {
                var $iframeParent = $iframe.parent();
                width = $iframeParent.width();
                self.$container.css('width', width + 'px');
            }
        }

        self.$image.css({
            width: width + 'px',
            height: height + 'px'
        });

        // XXX START CHANGES
        /*
        if (self.initialWidth === undefined) {
            self.initialWidth = self.$container.width();
        }
        */

        // HTK-hack - set minimum initialWidth to 800px to prevent too large hotspots when windows is later resized (iframe)
        if (self.initialWidth === undefined) {
            self.initialWidth = self.$container.width();
            if (width < 800) {
                self.initialWidth = 800;
            }
        }
        // XXX END CHANGES

        self.fontSize = (DEFAULT_FONT_SIZE * (width/self.initialWidth));

        self.$hotspotContainer.css({
            width: width + 'px',
            height: height + 'px',
            fontSize: self.fontSize + 'px'
        });

        self.isSmallDevice = (containerWidth / parseFloat($("body").css("font-size")) < 40);
    };
})(H5P.jQuery);
