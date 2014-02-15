/** Analytics tracking code **/
var Analytics = (function (angular) {		
    var gaqAccount = "";
	var domain = "";

	switch (window.location.host) {
	    case ('localhost:3000'):
	        domain = 'none';
	        gaqAccount = "UA-42049419-3";
	        break;
	    default: break;
	}

	// Init - Anything you want to happen onLoad (usually event bindings)
	// -------------------------------------------------------------------
	var init = function(){
        _gaq.push(['_setAccount', gaqAccount]);

        // Determine whether site is on staging, production or running locally.
        
        _gaq.push(['_setDomainName', domain]);
        _gaq.push(['_setAllowLinker', true]);
        _gaq.push(['_trackPageview']);

        (function() {
            var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
            ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
            var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
        })();

        angular.element(document).ready(function () {
            Analytics.bindEvents();
        });
	};		
		
		
	// FUNCTIONS
	// ===================================================================

	// Sanitize - Strips out potentially harmful characters from analytics
	// -------------------------------------------------------------------
	var sanitize = function( text ) {
		return text.replace(/\s?&|\s?;|\s?,|\s?\|/g, '').replace(/ /g, '-');
	};


	// Bind Events
	var bindEvents = function () {
		/*angular.element('#play-game').on('click', function(e){
			alert('you be playin eh?');
		});*/
	};
    

	// Return - Which variables and objects to make available publically
	// -------------------------------------------------------------------
	return {
		init 				: init,
		bindEvents			: bindEvents,
	}
})(angular);

var _gaq = _gaq || [];	
Analytics.init();