<?php

/**
 * Handler for Author VCard field
 */
class ov_oai_author_vcard extends views_handler_field {

  /**
   * Overrides views_handler_field::render().
   */
  function render($values) {
    $firstName = '';
    $lastName = '';

    $node = node_load($values->nid);
    $user = user_load($node->uid);

    if (!empty($user->field_first_name[LANGUAGE_NONE][0]['value'])) {
      $firstName = $user->field_first_name[LANGUAGE_NONE][0]['value'];
    }

    if (!empty($user->field_last_name[LANGUAGE_NONE][0]['value'])) {
      $lastName = $user->field_last_name[LANGUAGE_NONE][0]['value'];
    }

    $userEmail = $user->mail;

    // Sanitize and return.
    return $this->sanitize_value('<![CDATA[
      BEGIN:VCARD
      VERSION:3.0
      N:'. $lastName . ';' . $firstName . ';;;
      FN:' . $firstName . ' ' . $lastName .
      ' ORG:
      EMAIL;TYPE=internet,pref:' . $userEmail .
      ' END:VCARD
      ]]>');
  }

  /**
   * Overrides views_handler_field::query().
   */
  function query() {
    // do nothing -- to override the parent query.
  }
}


/**
 * Handler for EstCore Gymnasium taxonomy
 */
class ov_oai_taxon_path extends views_handler_field {

  /**
   * Overrides views_handler_field::render().
   */
  function render($values) {

    $taxonPaths = ['domain','subject','topic','subtopic','kala'];

    $node = node_load($values->nid);
    $term = $node->field_teema_2[LANGUAGE_NONE][0]['tid'];
    $parents = array_reverse(taxonomy_get_parents_all($term));

    $gymnasiumTaxonXml = '<gymnasiumTaxon><curriculum>KLRÕK2011</curriculum>';

    for($i = 0; $i < count($parents); $i++){
      $gymnasiumTaxonXml .= '<' . $taxonPaths[$i] . '>';
      $gymnasiumTaxonXml .= strtolower($parents[$i]->name);
      $gymnasiumTaxonXml .= '</' . $taxonPaths[$i] . '>';
    }

    $gymnasiumTaxonXml .= '</gymnasiumTaxon>';

    // Sanitize and return.
    return $gymnasiumTaxonXml;
  }

  /**
   * Overrides views_handler_field::query().
   */
  function query() {
    // do nothing -- to override the parent query.
  }
}