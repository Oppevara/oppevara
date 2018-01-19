addEventListener("load", function() {

	var nav_tabs = document.querySelectorAll("nav ol li a");
	for (var i = 0; i < nav_tabs.length; i++) {
		nav_tabs[i].addEventListener("click", function() {
			MathJax.Hub.Typeset();
		});
	}

});