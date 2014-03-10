function WindowGame($scope, $http, socket){
	// Booleans for showing the different views
	$scope.data = { 
		  message: "hello"
		, nameIsValid: false
		, emailIsValid: false
		, disabledForm: true 
		, userPlaceQue: '' 
		, showSignUp: true 
		, showUserQue: false
		, showUpNext: false
		, showGameScreen: false
		, showTerms: false
		, showPlayingGame: false
		, showEmailReason: false
		, showEndScreen: false
		, showEndMessage0: false
		, showEndMessage1: false
		, showEndMessage2: false
		, showWatchGame: false
		, showGameError: false
		, showFatalGameError: false
		, show404: false
		, showUserTimedOut: false 
		, showDonateLegal: false
		, showPrivacy: false
		, showLegal: false
		, isTimedOut: false
		, isPlayingAgain: false
		, currentView: ""
		, amountRised: ""
	};

	$http.get('/donationAmount').success(function(data){
		var myData = data.donation.replace('\n', '');
		$('.raised').html(myData);
	});

	$scope.user = {
		'id'	: document.getElementById('user_id').getAttribute("value"), // there is probably a better way to do this
		'name'	: '',
		'email'	: '',
		'isPlayingAgain': $scope.data.isPlayingAgain
	};

	/*
	 * SHARE LOGIC
	 */
	 $scope.share = function(channel){
	 	if ( channel == "facebook") {
	 		window.open('https://www.facebook.com/sharer/sharer.php?u=http%3A%2F%2Fwww.colonotron.org','Facebook','toolbar=0,status=0,width=580,height=325');
	 	} else {
	 		window.open('http://twitter.com/share/?url=google.com&text=Play to prevent colorectal cancer and learn how you can help us beat it. www.colonotron.org&hashtags=colonotron','Twitter','toolbar=0,status=0,width=580,height=325');
	 	}
	 };

	 $scope.blurFunction = function(type){ // Angular does not have a blur function built into their form validation
	 	if (type === "email"){ // We did not have time to properly do this the "angular" way.
	 		var email = $scope.user.email;  
	 		var EMAIL_REGX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
	 		if(EMAIL_REGX.test(email)){
	 			$('#email-error').removeClass('show');
	 			$('#user-email').removeClass('error');
				$('#play-game').attr('disabled', 'disabled');
	 		} else {
	 			$('#email-error').addClass('show');
	 			$('#user-email').addClass('error');
	 			$('#play-game').prop("disabled", false);
	 			
	 		}
	 	}
	 		var userName = $scope.user.name;
	 		var hasBadWord = false; // No bad words allowed.
			for (var i = 0; i < badWords.length; i++){
				if ( $scope.user.name == badWords[i]){
					hasBadWord = true;
				}
			}

			if (hasBadWord) { 
				form.uName.$invalid = true;
				$('#play-game').addClass('ng-disabled');
				$('#play-game').attr('disabled', 'disabled');
				$('#name-error').addClass('show');
				$('#sign-up').addClass('badword');
				$('#user-name').addClass('error');
			} else {
				$('#play-game').removeClass('ng-disabled');
				$('#play-game').prop("disabled", false);
				$('#name-error').removeClass('show');
				$('#sign-up').removeClass('badword');
				$('#user-name').removeClass('error');
			}
	 }

	 $scope.clearView = function(){ // Helper to clear all views
	 	$('html,body').scrollTop(0); // we need the user's view to be at the top of the window
	 	$scope.data.showSignUp = false;
		$scope.data.showUserQue = false;
		$scope.data.showUpNext = false;
		$scope.data.showGameScreen = false;
		$scope.data.showTerms = false;
		$scope.data.showPlayingGame = false;
		$scope.data.showEmailReason =  false;
		$scope.data.showEndScreen = false;
		$scope.data.showEndMessage0 = false;
		$scope.data.showEndMessage1 = false;
		$scope.data.showEndMessage2 = false;
		$scope.data.showGameError = false;
		$scope.data.show404 = false;
		$scope.data.showUserTimedOut = false;
		$scope.data.showWatchGame = false;
		$scope.data.showFatalGameError = false;
		$scope.data.showPrivacy = false;
		$scope.data.showLegal = false;
	 }

	/*
	 * STEP 1 USER SIGNS UP FOR GAME QUE
	 * TODO: app style page transitions
	 */
	$scope.addUser = function(){
		document.activeElement.blur();
		var thisUser = $scope.user;
		$scope.submitted = true;
		console.log(thisUser);
		// we need to set the id to the value of the scope
		$scope.user.id = document.getElementById('user_id').getAttribute("value");
		
		if (thisUser.name.length > 0 && thisUser.email.length > 0 && thisUser.id.length > 0){
			$http.post('/addUser', thisUser).success(function(data, status, headers, config){ // we need to save the user to the server
				if (data.isFirst){
					$scope.clearView();
					$scope.data.showUpNext = true;
					$('#legal, #privacy')
					//$scope.playSound();
				} else{
					$scope.clearView();
					$scope.data.showUserQue = true;
					$scope.data.userPlaceQue = data.queNumber;
				}
			});
			// Info for saving user name and email to email collector
			

    		//var postvars = userinputs + "&" + surveyinputs;
    		var postJson = {
    			  "name" : thisUser.name
    			, "email" : thisUser.email 
    		}
    		
			$http.post('/emailCollector', postJson).success(function(data, status, headers, config){
				console.log('we have stuff sent to /emailCollector');
				// maybe if we have no call back this will not hang
			});
		}
	};

	$scope.playAgain = function(){
		$scope.user.isPlayingAgain = true; // the user is playing again. add them to the que but not the user list
		$scope.clearView();
		$scope.addUser();
	};


	/*
	 * STEP 1.1 USER CLICKS TO SEE TERMS OF SERVICE OR to read about emails
	 */
	$scope.showTerms = function(){
		$scope.clearView();
		$scope.data.showTerms = true;
	}

	$scope.showEmailReason = function(){
		$scope.clearView();
		$scope.data.showEmailReason = true;
	}

	$scope.backToSignUp = function(){ // Legal notice and email question
		$scope.clearView();
		$scope.data.showSignUp = true;
	}

	$scope.showPrivacyPage = function(){ // Show the user the Privacy page
		$('html,body').scrollTop(0);
		$scope.data.showPrivacy = true;
	};

	$scope.showLegalPage = function(){ // Show the user the Legal page
		$('html,body').scrollTop(0);
		$scope.data.showLegal = true; 
	};

	$scope.backToView = function(viewLast){ // Hide the Legal or Privacy Pop-Over
		$scope.data.showPrivacy = false;
		$scope.data.showLegal = false;
		$('html,body').scrollTop(0);
	};

	/*
	 * STEP 2: User is promted to play the game
	 */
	$scope.playGame = function(){ // this is called from ng-click 
		$scope.clearView();
		$scope.data.showPlayingGame = true;
		socket.emit('userHitPlay'); // user is ready to play
	};

	$scope.userTimedOut = function(){ // The user has 30 seconds to press the play game button or they are removed
		$scope.clearView();
		$scope.data.showUserTimedOut = true;
	}

	$scope.userTimedOutExercise = function(){ // tell the user to watch the screen after 15 seconds
		$scope.clearView();
		$scope.data.showUserTimedOut = true;
	};
	

	/*
	 * Socket Listeners
	 */
	socket.on('yourId', function(data){
		userId = data;
		socket.emit('saveId', userId);
		document.getElementById('user_id').setAttribute("value", userId);
	});

	// Show the user the play game screen
	// this is called from /displayIsReady
	//=====================================================
	socket.on('showGameScreen', function(){
		$scope.clearView();
		$scope.data.showGameScreen = true;
	});

	// Event when user is added
	//=====================================================
	socket.on('addUserToQue', function(data){
		$scope.userlist.users.push({"name":data});
		console.log('add user to que fired');
	});

	// Event to update users place in line
	//=====================================================
	socket.on('updatePlaceInLine', function(data){
		$scope.data.userPlaceQue = data;
		console.log('we should have a new place called '+ data);
	});
	
	// Show the user they are about to play
	//=====================================================
	socket.on('timeToPlay', function(data){
		$scope.clearView();
		$scope.data.showUpNext = true;
		//$scope.playSound();
	});

	// Tell the user to watch the ball
	//=====================================================
	socket.on('watchBall', function(){
		$scope.clearView();
		$scope.data.showWatchGame = true;
	});

	// Show the user the different end screens end screen
	//=====================================================
	socket.on('showEndScreen', function(data){
		$scope.clearView();
		$scope.data.showEndScreen = true;
		
		switch(data) {
			case "0": // The user got a high score
				$scope.data.showEndMessage0 = true;
				$scope.data.showDonateLegal = true;
				break;

			case "1": // The user got a middle score
				$scope.data.showEndMessage1 = true;
				$scope.data.showDonateLegal = true;
				break;

			case "2": // The user got a low score
				$scope.data.showEndMessage2 = true;
				$scope.data.showDonateLegal = true;
				break; 

			case "4": // There was an error during the game
				$scope.clearView();
				$scope.data.showGameError = true;
				break;

			case "5": // The user has timed out and did not press the play button
				$scope.userTimedOut();
				$scope.data.showDonateLegal = true;
				break;

			case "6": // The user has timed out because they did not do the activity
				$scope.userTimedOutExercise(); // change the name of this call
				$scope.data.showDonateLegal = true;
				break;
		}
	});

	// After disconnect udpate the user's id with socket 
	//=====================================================
	socket.on('updateYourId', function(data){
		$scope.user.id = data; // 
	});
	
	socket.on('connect', function(){
		console.log('we are connected onthe client');
	});

	socket.on('reconnect', function(){
		console.log('this is reconnected and here is the id :' + socket.id);
		socket.emit('reConnectedSocket', $scope.user.id);
	});

	// Show fatal game error screen
	//============================
	socket.on('showFatalGameError', function(){
		console.log('why no error screen');
		$scope.clearView();
		$scope.data.showFatalGameError = true;
	});
	
	/*
	 * Code for playing audio on socket event
	 */
	$scope.playSound = function(filename){   
    	document.getElementById("sound").innerHTML=
    	'<audio autoplay="autoplay">'+
    		'<source src="/media/ding.mp3" type="audio/mpeg" />'+
    		'<source src="/media/ding.ogg" type="audio/ogg" />'+
    		'<embed hidden="true" autostart="true" loop="false" src="' + filename +'.mp3" />'+
    	'</audio>';
    }

    // Bad Word List
    //======================================================
    var badWords = ["adultxxx"
,"amateurcouples"
,"amateurhardcore"
,"amateurhousewives"
,"amateurnude"
,"amateurporn"
,"amateursex"
,"amateurxxx"
,"analcum"
,"analfuck"
,"analingus"
,"analjpg"
,"analpics"
,"analrape"
,"analraping"
,"analsex"
,"anilingus"
,"animalerotica"
,"animalsex"
,"asianass"
,"asianbabes"
,"asianbondage"
,"asianhardcore"
,"asiannude"
,"asianpics"
,"asianpleasures"
,"asianporn"
,"asianpussy"
,"asiansex"
,"asiansluts"
,"asianthumbnails"
,"asianxxx"
,"asiasex"
,"asphyxiophilia"
,"assfuck"
,"asshole"
,"assjpg"
,"asslic"
,"assphuc"
,"assphuk"
,"asspics"
,"autoerotic"
,"ballsac"
,"beasiality"
,"beastality"
,"beasteality"
,"beastial"
,"beastility"
,"beastlove"
,"beastsex"
,"beastuality"
,"beastyality"
,"beatiality"
,"beavershot"
,"bedroomcam"
,"bestiality"
,"bigblackcocks"
,"bigblacktits"
,"bigclits"
,"bigcock"
,"bigdick"
,"biggestcock"
,"bignipples"
,"bigpussy"
,"bigtit"
,"blackass"
,"blackcum"
,"blackcunt"
,"blowboy"
,"blowjob"
,"bondagepics"
,"bondagepictures"
,"bondagestories"
,"bondagevideos"
,"boner"
,"boylove"
,"buttbanger"
,"buttbanging"
,"buttfuck"
,"buttpirate"
,"buttplug"
,"buttreamer"
,"buttstuffer"
,"candyteen"
,"carpetmuncher"
,"celebnudes"
,"celebritiesnaked"
,"celebritiesnude"
,"celebritynude"
,"celebrityporn"
,"celebritysex"
,"celebsluts"
,"celebsnude"
,"chatsex"
,"chickswithdicks"
,"childporno"
,"childsex"
,"chinesepussy"
,"clit"
,"closeuppussy"
,"clubsex"
,"cock"
,"comebath"
,"comedrinkers"
,"comeeaters"
,"comefacial"
,"comeguzzlers"
,"comeshot"
,"coonass"
,"crotchless"
,"cumbath"
,"cumbucket"
,"cumcovered"
,"cumdrinkers"
,"cumeaters"
,"cumface"
,"cumfacial"
,"cumgallery"
,"cumguzzlers"
,"cumhole"
,"cuming"
,"cumload"
,"cumlovers"
,"cumqueen"
,"cums"
,"cunilingus"
,"cunnilingus"
,"cunt"
,"cybererotica"
,"cyberflix"
,"cyberlust"
,"cybernude"
,"cyberotica"
,"cyberporn"
,"cybersex"
,"cyberslut"
,"cyberteenpic"
,"dickhead"
,"dicklick"
,"dickmeat"
,"dicknasty"
,"dicksex"
,"dicksuck"
,"dildo"
,"dirtypictures"
,"dirtysex"
,"dogfuck"
,"doggiestyle"
,"doggystyle"
,"dogsex"
,"doublepenetration"
,"downblouse"
,"drippingpussy"
,"eatcum"
,"eatingcum"
,"eatingpussy"
,"eatpussy"
,"eatshit"
,"ebonyporn"
,"ebonysex"
,"ebonyxxxlinks"
,"ejaculate"
,"escortservice"
,"explicitsex"
,"extremehardcoresex"
,"extremesex"
,"facesit"
,"facialcum"
,"familysex"
,"farmgirl"
,"farmlove"
,"farmslut"
,"farmteen"
,"fatpussy"
,"fatsex"
,"fatxxx"
,"felatio"
,"fellatio"
,"feltch"
,"fingerfuck"
,"fistfuck"
,"fistin"
,"freeadultgames"
,"freeadultsex"
,"freeadultstories"
,"freebeast"
,"freeblackpics"
,"freeblacksites"
,"freedick"
,"freeerotic"
,"freefile"
,"freefuck"
,"freegay"
,"freehardcore"
,"freelesbian"
,"freelivesex"
,"freenakedwomen"
,"freenude"
,"freeoralsex"
,"freeporn"
,"freepussy"
,"freesex"
,"freesmut"
,"freeteensex"
,"freethebeast"
,"freetit"
,"freexxx"
,"frexxx"
,"fucc"
,"fuck"
,"fudgepacker"
,"fuk"
,"fvck"
,"gangbang"
,"gangrape"
,"gangraping"
,"gaybondage"
,"gayeroticstories"
,"gayhardcore"
,"gaynudes"
,"gayphotos"
,"gaypics"
,"gaypictures"
,"gayporn"
,"gaysexstories"
,"gaytwinks"
,"gayvideo"
,"gayxxx"
,"girlcam"
,"givehead"
,"gizzum"
,"gloryhole"
,"groupsex"
,"hairypussy"
,"hairywomen"
,"handjob"
,"hardcorehooters"
,"hardcorejunky"
,"hardcoremovies"
,"hardcorepics"
,"hardcorepictures"
,"hardcorepix"
,"hardcoreporn"
,"hardcorepussy"
,"hardcoresex"
,"hardcorevideo"
,"hardcorexxx"
,"harddicks"
,"hardecore"
,"hardniples"
,"hardnipples"
,"hardon"
,"hardporn"
,"hardsex"
,"harrypussy"
,"hollywoodwhores"
,"hootersex"
,"horny"
,"horseblow"
,"horsecum"
,"horsesex"
,"hotcum"
,"hotpussy"
,"hotsex"
,"hugedicks"
,"hugehooters"
,"hugemen"
,"hugenipples"
,"hugepussy"
,"hugetits"
,"illegalgirls"
,"illegalsex"
,"incestpic"
,"incestpix"
,"incestsex"
,"interracialhardcore"
,"interracialsex"
,"interracialxxx"
,"japanesebondage"
,"japaneseporn"
,"japansex"
,"jerkingoff"
,"jism"
,"jiz"
,"juicypussy"
,"kiddiepic"
,"kiddieporn"
,"kiddipix"
,"kiddiporn"
,"kidpix"
,"kidporn"
,"kidsex"
,"kike"
,"largedicks"
,"largepussy"
,"largetits"
,"latinohardcore"
,"latinonude"
,"latinoporn"
,"latinosluts"
,"legsex"
,"lesbianerotica"
,"lesbianhardcore"
,"lesbianorgies"
,"lesbianpics"
,"lesbianpictures"
,"lesbianporn"
,"littlenipples"
,"littletits"
,"liveporn"
,"livesex"
,"lolitapic"
,"lolitapix"
,"lolitasex"
,"longdicks"
,"longnipples"
,"masterbate"
,"masterbating"
,"masterbation"
,"mastrubation"
,"mastubation"
,"masturbate"
,"masturbating"
,"maturepussy"
,"maturewomennude"
,"megapussy"
,"mondoporno"
,"mpegsex"
,"muffdive"
,"nakedbabes"
,"nakedblackwomen"
,"nakedboy"
,"nakedcelebrities"
,"nakedchicks"
,"nakedchildren"
,"nakedgirl"
,"nakedkid"
,"nakedladies"
,"nakedmalecelebrities"
,"nakedmen"
,"nakedpictures"
,"nastychat"
,"nastypussy"
,"nastysex"
,"nastythumbs"
,"necrophilia"
,"negro"
,"netsex"
,"nigga"
,"nigger"
,"nudeactresses"
,"nudeasianwomen"
,"nudeblackmen"
,"nudeblackwomen"
,"nudeblondes"
,"nudeboy"
,"nudecartoons"
,"nudeceleb"
,"nudecollegegirls"
,"nudegay"
,"nudegirl"
,"nudehollywood"
,"nudeladies"
,"nudelesbians"
,"nudemalecelebrities"
,"nudemalecelebs"
,"nudemales"
,"nudemen"
,"nudeolderwomen"
,"nudephoto"
,"nudepics"
,"nudepicture"
,"nudepreteen"
,"nudepussy"
,"nudesex"
,"nudestars"
,"nudesupermodels"
,"nudeteen"
,"nudetoons"
,"nudeunderage"
,"nudevideoconferencing"
,"nudewomen"
,"oldersluts"
,"oldpussy"
,"oldsex"
,"oldsluts"
,"oralsex"
,"pantyfreek"
,"pantyhosefetish"
,"partysex"
,"peeon"
,"peepshow"
,"phonesex"
,"phreak"
,"phuc"
,"phuk"
,"picturesex"
,"picturesofsex"
,"picturessex"
,"pinkpussy"
,"porn"
,"preteen"
,"purehardcore"
,"pussie"
,"pusssy"
,"pussy"
,"raghead"
,"rapeme"
,"rapepic"
,"rapepix"
,"rawsex"
,"realhardcore"
,"realsex"
,"rimjob"
,"rimming"
,"s1ut"
,"scatlover"
,"scatology"
,"scatsex"
,"screwing"
,"seekforsex"
,"sex4free"
,"sexacts"
,"sexadult"
,"sexamateur"
,"sexanal"
,"sexandpictures"
,"sexavi"
,"sexcam"
,"sexcartoon"
,"sexcenterfolds"
,"sexchat"
,"sexcites"
,"sexcity"
,"sexclips"
,"sexclub"
,"sexcomics"
,"sexfantasy"
,"sexfarm"
,"sexfiction"
,"sexfiles"
,"sexfree"
,"sexgallery"
,"sexgames"
,"sexgirls"
,"sexgrand"
,"sexhardcore"
,"sexhound"
,"sexhungry"
,"seximages"
,"sexjuice"
,"sexland"
,"sexlinks"
,"sexlinx"
,"sexlist"
,"sexlookup"
,"sexmagazine"
,"sexmags"
,"sexmodels"
,"sexmovie"
,"sexmpegs"
,"sexnet"
,"sexnewsgroups"
,"sexnude"
,"sexnudity"
,"sexonline"
,"sexoral"
,"sexparty"
,"sexpersonals"
,"sexphoto"
,"sexpic"
,"sexpix"
,"sexplanet"
,"sexplaza"
,"sexploration"
,"sexpost"
,"sexsamples"
,"sexsexsex"
,"sexshare"
,"sexshop"
,"sexshow"
,"sexsite"
,"sexslave"
,"sexsource"
,"sexspaces"
,"sexstories"
,"sexstory"
,"sexswap"
,"sextales"
,"sexteen"
,"sextoon"
,"sextoy"
,"sexualadvantage"
,"sexuales"
,"sexualfantasies"
,"sexualpictures"
,"sexualstories"
,"sexuncensored"
,"sexvideo"
,"sexvillage"
,"sexvote"
,"sexworld"
,"sexx"
,"sexysites"
,"sexysquirter"
,"sexyupskirts"
,"shaved"
,"shemalecentral"
,"shemalepics"
,"shemalepictures"
,"shemalesex"
,"shiteat"
,"shiter"
,"shites"
,"shithead"
,"shits"
,"shitting"
,"sht"
,"shyted"
,"shyter"
,"shytes"
,"shyting"
,"shyts"
,"slavesex"
,"slut"
,"smalltits"
,"smut"
,"snufffilm"
,"snuffpic"
,"snuffpix"
,"spankingavi"
,"spankinglinks"
,"spankingpictures"
,"spermfacial"
,"strapon"
,"suckin"
,"supersex"
,"supertits"
,"swedenteens"
,"swedsex"
,"teenagesex"
,"teenerotica"
,"teenplay"
,"teensex"
,"teenshave"
,"teenxxx"
,"threesomes"
,"tinytits"
,"titbags"
,"titbondage"
,"titflesh"
,"tities"
,"tits"
,"tittie"
,"titts"
,"titty"
,"tokyotopless"
,"toonsex"
,"toplesswomen"
,"twat"
,"ultrahardcore"
,"uncut"
,"underagepic"
,"underagepix"
,"underagesex"
,"upskirt"
,"urinate"
,"urinating"
,"vibrator"
,"videosex"
,"virtualsex"
,"voyeurcam"
,"voyeurdorm"
,"voyuerweb"
,"warez"
,"websex"
,"wetpanties"
,"wetsex"
,"wetspot"
,"wetvagina"
,"whore"
,"wifeswapping"
,"wildsex"
,"wwwsex"
,"xpic"
,"xrated"
,"xxpasswords"
,"xxx"
,"youngsex"
,"zooass"
,"zoophile"
,"zoophilia"
,"zoose"
,"amateur couples"
,"amateur hardcore"
,"amateur housewives"
,"amateur nude"
,"amateur nudes"
,"amateur sex"
,"anal jpg"
,"anal pics"
,"anal rape"
,"anal raping"
,"anal sex"
,"animal erotica"
,"animal sex"
,"asian ass"
,"asian babes"
,"asian bondage"
,"asian hardcore"
,"asian nude"
,"asian nudes"
,"asian pics"
,"asian pleasures"
,"asian sex"
,"asian thumbnails"
,"ass jpg"
,"ass lick"
,"ass licking"
,"ass pics"
,"ass worship"
,"bedroom cam"
,"big dick"
,"big dicks"
,"big hooters"
,"big nipples"
,"big tit"
,"black ass"
,"black asses"
,"black dick"
,"black dicks"
,"black hardcore"
,"black sex"
,"bondage pics"
,"bondage pictures"
,"bondage stories"
,"bondage videos"
,"celebrities naked"
,"celebrities nude"
,"celebrity nude"
,"celebrity nudes"
,"celebs nude"
,"chat sex"
,"chicks with dicks"
,"come bath"
,"come drinkers"
,"come eaters"
,"come facial"
,"come facials"
,"come guzzlers"
,"come shot"
,"come shots"
,"cum drinkers"
,"cum eaters"
,"cum facial"
,"cum facials"
,"cum guzzlers"
,"cum shot"
,"cum shots"
,"cyber sex"
,"dick lick"
,"dick licker"
,"dick lickers"
,"dick licking"
,"dick lickings"
,"dick licks"
,"dick meat"
,"dick nasty"
,"dick suck"
,"dick sucker"
,"dick suckers"
,"dirty pictures"
,"dirty sex"
,"double penetration"
,"down blouse"
,"ebony sex"
,"escort service"
,"escort services"
,"extreme sex"
,"face sit"
,"face sitting"
,"facial cum"
,"family sex"
,"farm girl"
,"farm girls"
,"farm teen"
,"farm teens"
,"free adult games"
,"free adult stories"
,"free black pics"
,"free erotic"
,"free gay"
,"free hardcore"
,"free lesbian"
,"free live sex"
,"free naked women"
,"free nude"
,"free nudes"
,"free oral sex"
,"free sex"
,"free tit"
,"gang bang"
,"gang bangs"
,"gang rape"
,"gang raping"
,"gay hardcore"
,"gay nudes"
,"gay photos"
,"gay pics"
,"gay pictures"
,"gay sex stories"
,"gay twinks"
,"gay video"
,"girl cams"
,"golden shower"
,"golden showers"
,"group sex"
,"hard niples"
,"hard nipples"
,"hard sex"
,"hardcore hooters"
,"hardcore pics"
,"hardcore pictures"
,"hardcore sex"
,"hardcore video"
,"hardcore videos"
,"horse blow"
,"horse cum"
,"horse sex"
,"hot cum"
,"hot sex"
,"hot stories"
,"huge dicks"
,"huge hooters"
,"huge nipples"
,"interracial hardcore"
,"interracial sex"
,"japanese bondage"
,"jerking off"
,"latino hardcore"
,"latino nude"
,"latino nudes"
,"lesbian pics"
,"lesbian pictures"
,"live sex"
,"long nipples"
,"mature women nude"
,"mpeg sex"
,"muff dive"
,"naked babes"
,"naked black women"
,"naked celebrities"
,"naked chicks"
,"naked ladies"
,"naked male celebrities"
,"naked men"
,"naked pictures"
,"naked women"
,"nasty sex"
,"nude asian women"
,"nude black men"
,"nude black women"
,"nude blondes"
,"nude cartoons"
,"nude celeb"
,"nude celebrities"
,"nude celebrity"
,"nude celebs"
,"nude college girls"
,"nude gay"
,"nude ladies"
,"nude lesbians"
,"nude male celebrities"
,"nude male celebs"
,"nude males"
,"nude older women"
,"nude photo"
,"nude photographs"
,"nude photos"
,"nude pics"
,"nude picture"
,"nude pictures"
,"nude sex"
,"nude stars"
,"nude supermodels"
,"nude toons"
,"nude video conferencing"
,"old sex"
,"oral sex"
,"panty pics"
,"panty pictures"
,"panty shots"
,"pantyhose fetish"
,"picture sex"
,"pictures of sex"
,"pictures sex"
,"raw sex"
,"sex adult"
,"sex amateur"
,"sex anal"
,"sex and pictures"
,"sex avi"
,"sex cam"
,"sex cams"
,"sex cartoon"
,"sex cartoons"
,"sex chat"
,"sex clips"
,"sex club"
,"sex clubs"
,"sex comics"
,"sex fantasy"
,"sex free"
,"sex gallery"
,"sex games"
,"sex hardcore"
,"sex images"
,"sex links"
,"sex magazine"
,"sex magazines"
,"sex movie"
,"sex movies"
,"sex mpeg"
,"sex mpegs"
,"sex newsgroups"
,"sex nude"
,"sex nudity"
,"sex oral"
,"sex personals"
,"sex photo"
,"sex photos"
,"Sex pic"
,"Sex pics"
,"Sex picture"
,"Sex pictures"
,"Sex pix"
,"sex plaza"
,"sex samples"
,"sex search"
,"sex shop"
,"sex show"
,"sex shows"
,"sex site"
,"sex sites"
,"sex slave"
,"sex slaves"
,"sex sounds"
,"sex stories"
,"sex story"
,"sex storys"
,"sex toons"
,"sex toy"
,"sex toys"
,"sex video"
,"sex videos"
,"shemale pics"
,"shemale pictures"
,"shemale sex"
,"spanking avi"
,"spanking links"
,"spanking pictures"
,"sperm facial"
,"super sex"
,"tit bags"
,"tit flesh"
,"tokyo topless"
,"topless women"
,"video sex"
,"voyeur cam"
,"voyeur web"
,"weird sex"
,"wet sex"
,"x rated"
,"x ratedmovie"
,"x ratedmovies"
,"x ratedvideo"
,"x ratedvideos"
,"Dream for Darfur"
,"Tibetan Action Network"
,"Free Tibet"
,"STAND"
,"Dream for Darfur"
,"Team for Darfur"
,"Not on Our Watch"
,"Reporters Without Borders"
,"Committee to Protect Journalists"
,"Killer Coke"
,"India Resource Center"
,"Human Rights Watch"
,"Amnesty International"
,"Human Rights in China"
,"Sudan"
,"Darfur"
,"Genocide"
,"Tibet"
,"Tibetan"
,"Xinjiang"
,"Dalai Lama"
,"Monks"
,"Human rights"
,"Deception"
,"Immorality"
,"Labor abuse"
,"Environmental abuse"
,"Human rights abuse"
,"Animal abuse"
,"Cat culling"
,"Dog culling"
,"Workplace abuses"
,"Hitler"
,"Nazi"
,"Regime"
,"Rwanda"
,"Armenia"
,"Janjaweed"
,"Union leaders"
,"Pesticides"
,"Biosolids"
,"Water depletion"
,"Kerala"
,"Colombia"
,"Killing"
,"Kill"
,"Kills"
,"Killer"
,"Murder"
,"Murders"
,"Murderer"
,"Death"
,"Dead"
,"Dying"
,"Bloodshed"
,"Blood"
,"Pollution"
,"Pollutes"
,"Boycott"
,"Ban"
,"Protest"
,"Abuse"
,"Violence"
,"Crisis"
,"Conflict"
,"Evil"
,"Corrupt"
,"Corruption"
,"Suffering"
,"Suffer"
,"Repression"
,"Repress"
,"Torture"
,"Crackdown"
,"Arrests"
,"Political prisoner"
,"Exploit"
,"Exploitation"
,"Hate"]
}
