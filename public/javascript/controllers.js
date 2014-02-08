function WindowGame($scope, $http, socket){
	// Booleans for showing the different views
	$scope.data = { 
		  message: "hello"
		, userPlaceQue: '' 
		, showSignUp: true 
		, showUserQue: false
		, showGameScreen: false
		, showTerms: false
		, showPlayingGame: false
		, showEmailReason: false
		, showEndScreen: false
		, show404: false
		, showUserTimedOut: false
		, isTimedOut: false
		, isPlayingAgain: false
	};

	$scope.user = {
		'id'	: document.getElementById('user_id').getAttribute("value"), // there is probably a better way to do this
		'name'	: '',
		'email'	: '',
		'isPlayingAgain': $scope.data.isPlayingAgain
	};

	/*
	 * STEP 1 USER SIGNS UP FOR GAME QUE
	 * TODO: app style page transitions
	 */
	$scope.addUser = function(){
		var thisUser = $scope.user;
		console.log(thisUser);
		// we need to set the id to the value of the scope
		$scope.user.id = document.getElementById('user_id').getAttribute("value");
		if (thisUser.name.length > 0 && thisUser.email.length > 0 && thisUser.id.length > 0){
			// we need to save the user to the server
			$http.post('/addUser', thisUser).success(function(data, status, headers, config){
				if (data.isFirst){
					$scope.data.showSignUp = false;
					$scope.data.showGameScreen = true;
					$scope.setGameTimer();
					$scope.playSound();
				} else{
					$scope.data.showSignUp = false;
					$scope.data.showUserQue = true;
					$scope.data.userPlaceQue = data.queNumber;
				}
			});
		}
	};
	$scope.playAgain = function(){
		$scope.user.isPlayingAgain = true; // the user is playing again. add them to the que but not the user list
		$scope.data.showUserTimedOut = false;
		$scope.data.showEndScreen = false;
		// put into que, if not first show 

		$scope.addUser();
	};

	/*
	 * VALIDATE USER INPUT
	 * This is boiler plate from the angular docs, http://docs.angularjs.org/guide/forms
	 */
	$scope.master = {};

	$scope.update = function(user) {
		$scope.master = angular.copy(user);
	};

	$scope.isUnchanged = function(user) {
		return angular.equals(user, $scope.master);
	};

	/*
	 * STEP 1.1 USER CLICKS TO SEE TERMS OF SERVICE OR to read about emails
	 */
	$scope.showTerms = function(){
		$scope.data.showSignUp = false;
		$scope.data.showTerms = true;
	}

	$scope.showEmailReason = function(){
		$scope.data.showSignUp = false;
		$scope.data.showEmailReason = true;
	}

	$scope.backToSignUp = function(){
		$scope.data.showSignUp = true;
		$scope.data.showTerms = false;
		$scope.data.showEmailReason = false;
	}

	/*
	 * STEP 2: User is promted to play the game
	 */
	$scope.playGame = function(){
		$scope.data.showPlayingGame = true;
		$scope.data.showGameScreen = false;
		clearTimeout($scope.isTimedOut);
	};

	$scope.setGameTimer = function(){ // The user has 30 seconds to press the play game button or they are removed
		$scope.isTimedOut = setTimeout(function(){ 
			$scope.data.showGameScreen = false;
			$scope.data.showUserTimedOut = true;
			$scope.playSound();
			$scope.$apply();
			// we need to remove the from the que
			$http.post('/deleteUser').success( function(){ });
		}, 8000);
	}
	

	/*
	 * Socket Listeners
	 */
	socket.on('yourId', function(data){
		userId = data;
		socket.emit('saveId', userId);
		document.getElementById('user_id').setAttribute("value", userId);
		/*setTimeout(function(){
			console.log('we should have a disconnected socket');
			socket.disconnect();
		}, 9000);*/
	});


	// Event when user is added
	//=====================================================
	socket.on('addUserToQue', function(data){
		$scope.userlist.users.push({"name":data});
		console.log('add user to que fired');
	});
	
	// Show the user they are about to play
	//=====================================================
	socket.on('timeToPlay', function(data){
		$scope.data.showGameScreen = true;
		$scope.data.showUserQue = false;
		console.log('we are hitting the time to play event')
		$scope.playSound();
		$scope.setGameTimer();	
	});

	// Show the user the end screen
	//=====================================================
	socket.on('showEndScreen', function(){
		$scope.data.showEndScreen = true;
		$scope.data.showPlayingGame = false; 
		$scope.playSound();
	});
	
	socket.on('connect', function(){
		console.log('we are connected onthe client');
	});
	
	socket.on('disconnect', function(){
		console.log(socket.socket);
		//socket.emit('disClient');
		socketConnectTimeInterval = setInterval(function () {
	  		socket.socket.reconnect();
	  		if(socket.socket.connected) {
	  			clearInterval(socketConnectTimeInterval);
	  		}
		}, 3000);
	});
	
	socket.on('reconnect', function(){
		socket.emit('reClient');
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
}
