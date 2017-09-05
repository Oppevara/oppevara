var H5PEditor = H5PEditor || {};
H5PEditor.HtmlAddons = H5PEditor.HtmlAddons || {};
H5PEditor.HtmlAddons.h2 = H5PEditor.HtmlAddons.h2 || {};
H5PEditor.HtmlAddons.h2.h2 = function (config, tags) {

    config.extraAllowedContent = 'imgsubtitle'; // this might not be necessary

    config.format_tags += ';imgsubtitle';

    config.format_imgsubtitle = {
        name: 'Pildi allkiri',
        element: 'imgsubtitle',
        styles: {
            'font-weight': 'bold'
        }
    };

    // Re-add original ckeditor stylesheet and then our overrides
    config.contentsCss = [ H5PEditor.basePath + 'ckeditor/contents.css', Drupal.settings.basePath + 'sites/all/modules/oppevara/ov_styles/css/ov_h5p_overrides.css' ];
};