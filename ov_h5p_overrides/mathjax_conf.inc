<?php

function ov_h5p_overrides_page_callback() {
  Header("content-type: application/x-javascript");

  echo "MathJax.Ajax.loadComplete('" . $GLOBALS['base_url'] . "/ov_h5p/mathjax_conf.js');";

  echo <<< MATHJAXJS
  
MathJax.Hub.Config(
    {
        tex2jax: {
            inlineMath: [
                ['$$','$$']
            ],
            displayMath: [ ['$$$','$$$'] ]
        }
    }
);

// Dispatch resize event when math rendering is complete (for H5P iframe resize)
MathJax.Hub.Queue(function () {
  window.top.dispatchEvent(new Event('resize'));
});
MATHJAXJS;
}