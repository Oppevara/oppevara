<?php

function ov_bulk_coauthors_query() {
  $query = new EntityFieldQuery();
  $result = $query
    ->entityCondition('entity_type', 'node')
    ->propertyCondition('type', 'h5p_content')
    ->propertyCondition('uid', '61');
  $result = $query->execute();
  $nids = array_keys($result['node']);
  $count = 0;
  foreach (node_load_multiple($nids) as $node){
    $node->field_coauthors['und'][] = ['uid' => 60];
    $node->field_coauthors['und'][] = ['uid' => 46];
    $node->field_coauthors['und'][] = ['uid' => 12];
    node_save($node);
    $count++;
  };
  echo 'Changed nodes count: ' . $count;
}
