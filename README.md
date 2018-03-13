# Digiõppevara

## Coding standards

All code should follow the [coding standards](https://www.drupal.org/docs/develop/standards) established by Drupal Core team.

## Requirements

* Drupal 7 and its modules:
   * [H5P](https://www.drupal.org/project/h5p)
   * H5P Editor
   * xH5p CKEditor Math input
   * [Digiõppevaramu](https://github.com/Oppevara/oppevara)
      * Digiõppevara Access
      * Digiõppevara H5P overrides
      * Digiõppevara Styles
   * Taxonomy
   * [Taxonomy CSV import/export](https://www.drupal.org/project/taxonomy_csv)
* PHP 7.0.14
* MySQL 5.7.14

## Submodules

### ov_access

#### Configuration
1. Create the role for Expert.
2. Make sure that the **h5p_content** and **user** have taxonomy based fields, these should be based on the same hierarchy.
    * Make sure that the field on **h5p_content** is configured to be single-valued.
    * The one for **user** will only be available to people with administrating rights, once properly configured.
3. Go to the settings page, select suitable role and fields and save that configuration.

#### Applied logic
System will then try to check if any of the terms within the user profile would match with the one (or any of its parents) selected within the entity. In case of successful match, user will be granted an **update** permission to certain entities.

## Quirks and fixes

1. By default, the server does not know about the .h5p file type, this raises an issue with files not being downloaded but shown inline instead. See [this](https://h5p.org/node/10840) and [this](https://www.drupal.org/node/417866) for more insights and detailed explanations. There are a few ways to fix that (first two solutions are initially the same and require a restart to the service; the third one could be written in a different way and should work without any extensive rights or restarts):
      - Add this line to `application/x-h5p h5p` **mime.types** file used by the server
      - Add this directive `AddType application/x-h5p .h5p` to the **mod_mime** portion of **httpd.conf** file
      - Add this to the **.htaccess** file of the instance (a standalone file could be added directly into the directory with all the exportable packages; this one seems to be the default **DRUPAL_ROOT/sites/default/files/h5p/exports**)
        ```
        <FilesMatch "\.(?i:h5p)$">
            ForceType application/octet-stream
            Header set Content-Disposition attachment
        </FilesMatch>
        ```
    
2. As of Drupal 7.50, Drupal core now protects against clickjacking by default by emitting the 'X-Frame-Options: SAMEORIGIN' header. This prevents the site from being embedded in an iframe on another domain. [Documentation](https://www.drupal.org/node/2735873)
   
   To override the default behaviour, easiest is to set the 'x_frame_option' variable in settings.php:
    ```
      // Turn off the X-Frame-Options header entirely, to restore the previous
      // behavior of allowing the site to be embedded in a frame on another site.
      $conf['x_frame_options'] = '';
    ```
