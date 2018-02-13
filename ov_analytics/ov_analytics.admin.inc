<?php

/**
 * @file
 * Drupal Oppevara Analytics module admin settings page
 */

/**
 * Callback for analytics settings administration page
 * @param  array $form       An array with form structure
 * @param  array $form_state An array with current form state data
 * @return array             Strucured system settings form
 */
function ov_analytics_admin_settings($form, $form_state) {
  $form['xapi'] = [
    '#type' => 'fieldset',
    '#title' => t('xAPI Settings'),
  ];

  $form['xapi']['ov_analytics_xapi_lrs_endpoint'] = [
    '#type' => 'textfield',
    '#title' => t('Endpoint'),
    '#description' => t('The server endpoint.  Do not include a trailing slash.'),
    '#default_value' => variable_get('ov_analytics_xapi_lrs_endpoint', ''),
    '#required' => TRUE,
  ];

  $form['xapi']['ov_analytics_xapi_lrs_auth_user'] = [
    '#type' => 'textfield',
    '#title' => t('User'),
    '#description' => t('The basic authenication user.'),
    '#default_value' => variable_get('ov_analytics_xapi_lrs_auth_user', ''),
    '#required' => TRUE,
  ];

  $form['xapi']['ov_analytics_xapi_lrs_auth_password'] = [
    '#type' => 'textfield',
    '#title' => t('Password'),
    '#description' => t('The basic authenication password.'),
    '#default_value' => variable_get('ov_analytics_xapi_lrs_auth_password', ''),
    '#required' => TRUE,
  ];

  return system_settings_form($form);
}
