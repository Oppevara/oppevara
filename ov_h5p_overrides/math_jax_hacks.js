addEventListener("load", function() {

	function augment_rule(src, base_rules, pre_selector) {
		var pieces = src.split("{");
		var selector = (pre_selector === undefined ? "" : pre_selector) + " " + pieces[0];

		pieces = pieces[1].split(";");
		var rules = {};
		for (var key in base_rules) rules[key] = base_rules[key];

		for (var i = 0; i < pieces.length; i++) {
			var r_pieces = pieces[i].split(":");
			rules[r_pieces[0].replace(/\s/g,'')] = r_pieces[1];
		}

		var ret = selector + " { ";
		for (var key in rules) {
			ret += key + ":" + rules[key] + ";"
		}

		ret += "} ";
		return ret;
	}



	function mjx_reload() {
		MathJax.Hub.Typeset();
	}

	function mjx_hacks(mjx_style) {
		//	::: mjx style force on course presentation :::
		var min_reset_rules = { "line-height" : "0" };
		var rules = mjx_style.innerHTML.replace(/\n|\r/g, "").split("}");
		var n_css = "";
		for (var i = 0; i < rules.length - 1; i++) {
			if (rules[i][0] === "@") continue;
			n_css += augment_rule(rules[i], min_reset_rules, ".h5p-course-presentation .h5p-advanced-text") + "\n";
		}
		
		//	add new style
		var el = document.createElement("style");
		el.innerHTML = n_css;
		document.head.appendChild(el);
	}

	//	::: wait for mjx to load :::
	function mjx_load_check() {
		var all_styles = document.querySelectorAll("style");
		var mjx_style = undefined;
		for (var i = 0; i < all_styles.length; i++) {
			if (all_styles[i].innerHTML.indexOf(".mjx-chtml") !== -1) {
				mjx_style = all_styles[i];
				break;
			}
		}

		if (mjx_style !== undefined) {
			mjx_hacks(mjx_style);
		} else {
			setTimeout(mjx_load_check, 100);
		}
	}
	mjx_load_check();

	//	::: mjx late load triggers :::
	function add_math_jax_triggers(selector) {
		var els = document.querySelectorAll(selector);
		for (var i = 0; i < els.length; i++) {
			els[i].addEventListener("click", mjx_reload);
		}
	}

	add_math_jax_triggers("nav ol li a");
	add_math_jax_triggers(".h5p-footer-next-slide");
	add_math_jax_triggers(".h5p-footer-previous-slide");
	add_math_jax_triggers(".h5p-image-hotspot");


});