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

  $data['node']['taxon_path'] = array(
    'title' => t('EstCore Taxonomy XML'),
    'help' => t('Generates XML from taxonomy for OAI-PMH'),
    'field' => array(
      'handler' => 'ov_oai_taxon_path',
    ),
  );

  return $data;
}