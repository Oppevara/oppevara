<?php

/**
 * @file
 * Drupal Oppevara Challenge module admin settings page
 */

/**
 * Callback for challenge settings administration page
 * @param  array $form       An array with form structure
 * @param  array $form_state An array with current form state data
 * @return array             Strucured system settings form
 */
function ov_challenge_admin_settings($form, $form_state) {
  $form['recaptcha'] = [
    '#type' => 'fieldset',
    '#title' => t('reCAPTCHA settings (V2 standard)'),
  ];

  $form['recaptcha']['ov_challenge_recaptcha_site_key'] = [
    '#type' => 'textfield',
    '#title' => t('Site key'),
    '#description' => t('Use this in the HTML code your site serves to users.'),
    '#default_value' => variable_get('ov_challenge_recaptcha_site_key', ''),
    '#required' => TRUE,
  ];

  $form['recaptcha']['ov_challenge_recaptcha_secret_key'] = [
    '#type' => 'textfield',
    '#title' => t('Secret key'),
    '#description' => t('Use this for communication between your site and Google. Be sure to keep it a secret.'),
    '#default_value' => variable_get('ov_challenge_recaptcha_secret_key', ''),
    '#required' => TRUE,
  ];

  return system_settings_form($form);
}
