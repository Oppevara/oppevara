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
    return '<![CDATA[
      BEGIN:VCARD
      VERSION:3.0
      N:'. $lastName . ';' . $firstName . ';;;
      FN:' . $firstName . ' ' . $lastName .
      ' ORG:
      EMAIL;TYPE=internet,pref:' . $userEmail .
      ' END:VCARD
      ]]>';
  }

  /**
   * Overrides views_handler_field::query().
   */
  function query() {
    // do nothing -- to override the parent query.
  }
}


/**
 * Handler for contributors XML combo-element
 */
class ov_oai_xml_contribute extends views_handler_field {

  /**
   * Overrides views_handler_field::render().
   */
  function render($values) {
    $xml = '';

    $node = node_load($values->nid);
    $users = [];

    // Add main author
    array_push($users, user_load($node->uid));

    // Add coauthors
    if(!empty($node->field_coauthors)){
      foreach ($node->field_coauthors[LANGUAGE_NONE] as $coauthor){
        array_push($users, user_load($coauthor['uid']));
      }
    }

    foreach ($users as $user){
      $firstName = '';
      $lastName = '';

      if (!empty($user->field_first_name[LANGUAGE_NONE][0]['value'])) {
        $firstName = $user->field_first_name[LANGUAGE_NONE][0]['value'];
      }

      if (!empty($user->field_last_name[LANGUAGE_NONE][0]['value'])) {
        $lastName = $user->field_last_name[LANGUAGE_NONE][0]['value'];
      }

      $userEmail = $user->mail;

      // Generate VCard
      $vcard = '<![CDATA[
      BEGIN:VCARD
      VERSION:3.0
      N:'. $lastName . ';' . $firstName . ';;;
      FN:' . $firstName . ' ' . $lastName .
        ' ORG:
      EMAIL;TYPE=internet,pref:' . $userEmail .
        ' END:VCARD
      ]]>';

      // Add author
      $xml .= '<contribute>
        <lom:role>
          <lom:source>LOMv1.0</lom:source>
          <lom:value>author</lom:value>
        </lom:role>
        <lom:entity>' . $vcard . '</lom:entity>
        <lom:date uniqueElementName="date">
            <lom:dateTime>' . date('c', $node->created) . '</lom:dateTime>
        </lom:date>
      </contribute>';
    }

    // Add publisher info (for date)
    $xml .= '<contribute>
        <lom:role>
            <lom:source>LOMv1.0</lom:source>
            <lom:value>publisher</lom:value>
        </lom:role>
        <lom:date uniqueElementName="date">
            <lom:dateTime>' . date('c', $node->created) . '</lom:dateTime>
        </lom:date>
      </contribute>';

    return $xml;
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



/**
 * Handler for H5P Embed code generation
 */
class ov_oai_h5p_embed_code extends views_handler_field {

  /**
   * Overrides views_handler_field::render().
   */
  function render($values) {

    global $base_url;

    $embedCode = '<![CDATA[';
    $embedCode .= '<iframe src="' . $base_url . '/h5p/embed/' . $values->nid . '" frameborder="0" allowfullscreen="allowfullscreen"></iframe>';
    $embedCode .= '<script src="' . $base_url . '/' . drupal_get_path('module', 'h5p') . '/library/js/h5p-resizer.js" charset="UTF-8"></script>';
    $embedCode .= ']]>';

    // Sanitize and return.
    return $embedCode;
  }

  /**
   * Overrides views_handler_field::query().
   */
  function query() {
    // do nothing -- to override the parent query.
  }
}

/**
 * Handler for XML title field
 */
class ov_oai_xml_title extends views_handler_field {

  /**
   * Overrides views_handler_field::render().
   */
  function render($values) {

    $node = node_load($values->nid);

    $xml = '<lom:string language="et">';
    $xml .= $node->title;
    $xml .= '</lom:string>';

    // Sanitize and return.
    return $xml;
  }

  /**
   * Overrides views_handler_field::query().
   */
  function query() {
    // do nothing -- to override the parent query.
  }
}


/**
 * Handler for XML license field
 */
class ov_oai_xml_license extends views_handler_field {

  /**
   * Overrides views_handler_field::render().
   */
  function render($values) {

    $xml = '<string language="x-t-cc-url">http://creativecommons.org/licenses/by/3.0/</string>';

    // Sanitize and return.
    return $xml;
  }

  /**
   * Overrides views_handler_field::query().
   */
  function query() {
    // do nothing -- to override the parent query.
  }
}

/**
 * Handler for just returning "no" - because otherwise Drupal will translate it
 */
class ov_oai_xml_string_no extends views_handler_field {

  function render($values) {

    // Yup, this is all that it's doing...
    return 'no';
  }

  function query() {
    // do nothing -- to override the parent query.
  }
}

/**
 * Handler for just returning "yes" - because otherwise Drupal will translate it
 */
class ov_oai_xml_string_yes extends views_handler_field {

  function render($values) {

    // Yup, this is all that it's doing...
    return 'yes';
  }

  function query() {
    // do nothing -- to override the parent query.
  }
}

/**
 * Handler for XML title field
 */
class ov_oai_xml_keywords extends views_handler_field {

  /**
   * Overrides views_handler_field::render().
   */
  function render($values) {

    $node = node_load($values->nid);

    field_view_field('node', $node, 'field_sildid', array('default'));

    // set default tag
    $xml = '<lom:string language="et">TLU materjal</lom:string>';

    if(isset($node->field_sildid)){
      foreach($node->field_sildid[LANGUAGE_NONE] as $term){
        $xml .= '<lom:string language="et">' . $term["taxonomy_term"]->name . '</lom:string>';
      }
    }

    // Sanitize and return.
    return $xml;
  }

  /**
   * Overrides views_handler_field::query().
   */
  function query() {
    // do nothing -- to override the parent query.
  }
}
