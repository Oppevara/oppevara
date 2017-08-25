<?php

/**
 * @file
 * Drupal Oppevara Access module admin settings page
 */

/**
 * Processes fields for certain entity bundle and returns an array of items that
 * could be used as a value for options select. Both entity_type and bundle_name
 * are required, the code expects results to be fields, not bundles with
 * corresponding fields within them. Defaults to an empty array.
 * @param  string $entity_type Entity type
 * @param  string $bundle_name Bundle name
 * @return array               Array with field_name => field_label
 */
function ov_access_field_info_instances_options($entity_type, $bundle_name) {
  $data = [];
  $tmp = field_info_instances($entity_type, $bundle_name);

  if (is_array($tmp) && count($tmp) > 0) {
    foreach($tmp as $field) {
      $data[$field['field_name']] = $field['label'];
    }
  }

  return $data;
}

/**
 * Callback for access settings administration page
 * @param  array $form       An array with form structure
 * @param  array $form_state An array with current form state data
 * @return array             Strucured system settings form
 */
function ov_access_admin_settings($form, $form_state) {
  $user_roles_options = user_roles(true);
  $h5p_topic_fields_options = ov_access_field_info_instances_options('node', 'h5p_content');
  $account_fields_options = ov_access_field_info_instances_options('user', 'user');

  $form['ov_access_expert_access'] = [
    '#type' => 'fieldset',
    '#title' => t('Expert role access override settings'),
    '#description' => t('All of these settings are required in order to enable access override. Both fields should be using the same taxonomy. The one attached to the user profile will be only available to the administrators to change.'),

  ];
  $form['ov_access_expert_access']['ov_access_expert_role'] = [
    '#title' => t('Expert role'),
    '#description' => t('Please select a role that should be used for Expert access override.'),
    '#options' => $user_roles_options,
    '#default_value' => variable_get('ov_access_expert_role', null),
    '#type' => 'select',
    '#required' => TRUE,
  ];
  $form['ov_access_expert_access']['ov_access_h5p_topic_field'] = [
    '#title' => t('H5P content type taxonomy field'),
    '#description' => t('Please select a field that holds relation to material topic term.'),
    '#options' => $h5p_topic_fields_options,
    '#default_value' => variable_get('ov_access_h5p_topic_field', null),
    '#type' => 'select',
    '#required' => TRUE,
  ];
  $form['ov_access_expert_access']['ov_access_account_subject_field'] = [
    '#title' => t('User account taxonomy field'),
    '#description' => t('Please select a field that holds relation to subjects the user is an expert in.'),
    '#options' => $account_fields_options,
    '#default_value' => variable_get('ov_access_account_subject_field', null),
    '#type' => 'select',
    '#required' => TRUE,
  ];

  return system_settings_form($form);
}
