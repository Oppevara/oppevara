addEventListener("load", function() {
	var lazy_math_jax_iter = 0;
	function lazy_math_jax() {
		MathJax.Hub.Typeset();
		if (lazy_math_jax_iter++ < 10) setTimeout(lazy_math_jax, 500);
	}
	lazy_math_jax();
});