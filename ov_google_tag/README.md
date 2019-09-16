# Õppevara Google Tag Manager

This module is based on
[Google Tag Manager](https://www.drupal.org/project/google_tag) implementation
and uses that as a base. Some code is also a straight copy-paste from the
outlined module. This means that all of the configuration, checks and changes
would apply to the H5P embed view.

The only purpose of this module is to add Google Tag Manager integration into
the view used for external embedding of content. It uses the same generated JS
file as the original module does.

## NB! Quirks and fixed

1. The H5P module codebase does not allow inclusion of the HTML into the view.
Current implementation is also missing code for additional_embed_head_tags to be
properly allowed and corresponding hook triggered. Manual changes would be
required to allow one to add additional html into that page.

This line of code should be added into the embed view file right after
[<body>](https://git.drupalcode.org/project/h5p/blob/7.x-1.x/library/embed.php#L14):
```
<?php if (!empty($additional_embed_html)): print implode("\n", $additional_embed_html); endif; ?>
```

A hook would have to be triggered right before the inclusion of the
[view file](https://git.drupalcode.org/project/h5p/blob/7.x-1.x/h5p.module#L1523):
```
$additional_embed_html = [];
drupal_alter('h5p_additional_embed_html', $additional_embed_html);
```

If there is a need to enable the missing headers hook, one could also include
these lines of code:
```
$additional_embed_head_tags = [];
drupal_alter('h5p_additional_embed_head_tags', $additional_embed_head_tags);
```
