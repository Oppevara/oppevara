addEventListener("load", function() {

	function add_math_jax_triggers(selector) {
		var els = document.querySelectorAll(selector);
		for (var i = 0; i < els.length; i++) {
			console.log(els[i]);
			els[i].addEventListener("click", function() {
				MathJax.Hub.Typeset();
			});
		}
	}

	add_math_jax_triggers("nav ol li a");
	add_math_jax_triggers(".h5p-footer-next-slide");
	add_math_jax_triggers(".h5p-footer-previous-slide");
	add_math_jax_triggers(".h5p-image-hotspot");
});