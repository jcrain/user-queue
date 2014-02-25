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
		$(document).on('click', '#why-email', function(e){
			_gaq.push(['_trackEvent', 'Start Page', 'Question Mark on Email', 'Takes user to more info on why email address is necessary']);	
		})
		.on('submit', '#sign-up', function(){
			_gaq.push(['_trackEvent', 'Start Page', $('#user-name').val(), 'Provide First Name']);
			_gaq.push(['_trackEvent', 'Start Page', $('#user-email').val(), 'Provide Email Address']);
			_gaq.push(['_trackEvent', 'Start Page', 'Submit Button', 'Takes visitor to queue to play queue']);
		})
		.on('click', '#legal', function(){
			_gaq.push(['_trackEvent', 'Start Page', 'Legal Notices', 'Takes visitor to legal  notces page']);
		})
		.on('click', '#play-game', function(){
			_gaq.push(['_trackEvent', 'Display is Ready Page', 'Play Button', 'Directs visitor to begin game on monitor on window']);
		})
		.on('click', '.share.facebook.splash', function(){
			_gaq.push(['_trackEvent', 'Finished Game Page', 'Facebook Share', 'Takes visitor to share on FB']);
		})
		.on('click', '.share.twitter.splash', function(){
			_gaq.push(['_trackEvent', 'Finished Game Page', 'Twitter Share', 'Takes visitor to share on TW']);
		})
		.on('click', '.play-again', function(){
			_gaq.push(['_trackEvent', 'Finished Game Page', 'Play Again Button', 'Redirects visitor back into queue']);
		})
		.on('click', '.challenge-site', function(){
			_gaq.push(['_trackEvent', 'Finished Game Page', 'CCCF Website Link', 'Takes visitor to the CCCF website']);
		}) 
		.on('click', '#ehealth', function(){
			_gaq.push(['_trackEvent', 'Finished Game Page', 'Emblem Health Logo', 'Takes visitor to emblem health site']);
		})
		.on('click', '#challenge-site', function(){
			_gaq.push(['_trackEvent', 'Finished Game Page', 'CCCF Logo', 'Takes visitor to CCCF site']);
		}) //===================SPLASH PAGE TAGS =================//
		.on('click', '#donate-online', function(){
			_gaq.push(['_trackEvent', 'CCCF Homepage', 'Make an online donation', 'Takes visitor to online donation page']);
		})
		.on('click', '#home-ccc-link', function(){
			_gaq.push(['_trackEvent', 'CCCF Homepage', 'Colon Cancer Challenge Page link in text to donate', 'Takes visitor to colon cancer challenge page']);
		})
		.on('click', '.share.facebook.home', function(){
			_gaq.push(['_trackEvent', 'Finished Game Page', 'Facebook Share', 'Takes visitor to share on FB']);
		})
		.on('click', '.share.twitter.home', function(){
			_gaq.push(['_trackEvent', 'Finished Game Page', 'Twitter Share', 'Takes visitor to share on TW']);
		})
		.on('click', '#ehealth-home', function(){
			_gaq.push(['_trackEvent', 'CCCF Homepage', 'Emblem Health Logo', 'Takes visitor to emblem health site']);
		})
		.on('click', '#challenge-site-home', function(){
			_gaq.push(['_trackEvent', 'CCCF Homepage', 'CCCF Logo', 'Takes visitor to CCCF site']);
		});
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















