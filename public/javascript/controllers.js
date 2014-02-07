function WindowGame($scope, $http, socket){
	$scope.data = { 
		  message: "hello"
		, showSignUp: true 
		, showUserQue: false
		, showGameScreen: false
		, showTerms: false
		, showPlayingGame: false
		, showEmailReason: false
		, showEndScreen: false
		, show404: false
		, showUserTimedOut: false
	};

	$scope.user = {
		'id'	: document.getElementById('user_id').getAttribute("value"), // there is probably a better way to do this
		'name'	: '',
		'email'	: ''
	};

	$scope.userlist
	$http.get('/getQue').success(function(data){
		$scope.userlist = data;
		console.log(data);
	});



	/*
	 * STEP 1 USER SIGNS UP FOR GAME QUE
	 */
	 // TODO: app style page transitions
	$scope.addUser = function(){
		var thisUser = $scope.user;
		console.log(thisUser);
		// we need to set the id to the value of the scope
		$scope.user.id = document.getElementById('user_id').getAttribute("value");
		if (thisUser.name.length > 0 && thisUser.email.length > 0 && thisUser.id.length > 0){
			// we need to save the user to the server
			$http.post('/addUser', thisUser).success(function(data, status, headers, config){
				$scope.data.showSignUp = false;
				$scope.data.showUserQue = true;
				socket.emit('newUserAdded', thisUser.name); // Now 
			});
		}
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
	};
	

	// Socket Listeners
	//=====================================================
	socket.on('yourId', function(data){
	//alert(data);
	// we get our id here
	userId = data;
	socket.emit('saveId', userId);
	document.getElementById('user_id').setAttribute("value", userId);
	// 
	/*setTimeout(function(){
		console.log('we should have a disconnected socket');
		socket.disconnect();
	}, 9000);*/
	});

	// Event when user is added
	socket.on('addUserToQue', function(data){
		$scope.userlist.users.push({"name":data});
		console.log('add user to que fired');
	});

	socket.on('alert', function(data){
		alert('this is the post alert')
	})
	
	// Show the user they are about to play
	socket.on('timeToPlay', function(data){
		$scope.data.showGameScreen = true;
		$scope.data.showUserQue = false;
		console.log('we are hitting the time to play event')
	});

	// Show the user the end screen
	socket.on('showEndScreen', function(){
		$scope.data.showEndScreen = true;
		$scope.data.showPlayingGame = false; 
	});
	
	socket.on('connect', function(){
		console.log('we are connected onthe client');
	});
	
	socket.on('disconnect', function(){
		console.log('this is the disconnect event');
		console.log(socket.socket);
		//socket.emit('disClient');
		socketConnectTimeInterval = setInterval(function () {
	  		socket.socket.reconnect();
	  		if(socket.socket.connected) {
	  			clearInterval(socketConnectTimeInterval);
	  			console.log('we are reconnected after being disconnected');
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
		console.log('we are in playsoundl');
    	document.getElementById("sound").innerHTML=
    	'<audio autoplay="autoplay">'+
    		'<source src="/media/ding.mp3" type="audio/mpeg" />'+
    		'<source src="/media/ding.ogg" type="audio/ogg" />'+
    		'<embed hidden="true" autostart="true" loop="false" src="' + filename +'.mp3" />'+
    	'</audio>';
    }
}

function StartScreen($scope, $http){


}

function ShowShareScreen($scope, $http){
	// After the user has finsihed the game
	// we want to hide their game screen and show some sort of dropping ball 
	// o with a share button
}