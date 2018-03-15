<?php

/**
 * Implements hook_views_data().
 */
function ov_oai_views_data() {
  $data = array();

  $data['node']['author_vcard'] = array(
    'title' => t('Author VCard'),
    'help' => t('Generates VCard from authors full name and email address'),
    'field' => array(
      'handler' => 'ov_oai_author_vcard',
    ),
  );

  $data['node']['xml_contribute'] = array(
    'title' => t('Contributors XML'),
    'help' => t('Generates full XML for contribute field with author and publisher + vcard'),
    'field' => array(
      'handler' => 'ov_oai_xml_contribute',
    ),
  );

  $data['node']['taxon_path'] = array(
    'title' => t('EstCore Taxonomy XML'),
    'help' => t('Generates XML from taxonomy for OAI-PMH'),
    'field' => array(
      'handler' => 'ov_oai_taxon_path',
    ),
  );

  $data['node']['h5p_embed_code'] = array(
    'title' => t('H5P Embed code'),
    'help' => t('Generates H5P object\'s embed code for OAI-PMH'),
    'field' => array(
      'handler' => 'ov_oai_h5p_embed_code',
    ),
  );

  $data['node']['xml_title'] = array(
    'title' => t('Title with language XML'),
    'help' => t('Generates XML element with language as attribute'),
    'field' => array(
      'handler' => 'ov_oai_xml_title',
    ),
  );

  $data['node']['xml_license'] = array(
    'title' => t('License XML'),
    'help' => t('Generates XML element with CC-BY license and attribute'),
    'field' => array(
      'handler' => 'ov_oai_xml_license',
    ),
  );

  $data['node']['xml_string_no'] = array(
    'title' => t('Custom Text - "no"'),
    'help' => t('Just prints "no" - so Drupal wouldn\'t translate it'),
    'field' => array(
      'handler' => 'ov_oai_xml_string_no',
    ),
  );

  $data['node']['xml_string_yes'] = array(
    'title' => t('Custom Text - "yes"'),
    'help' => t('Just prints "yes" - so Drupal wouldn\'t translate it'),
    'field' => array(
      'handler' => 'ov_oai_xml_string_yes',
    ),
  );

  return $data;
}