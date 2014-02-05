function WindowGame($scope, $http, socket){
	$scope.data = { 
		  message: "hello"
		, showSignUp: false
		, showWelcomeMessage: true
		, showUserQue: false
		, showGameScreen: false
	};

	$scope.user = {
		'id'	: document.getElementById('user_id').getAttribute("value"), // there is probably a better way to do this
		'name'	: '',
		'email'	: ''
	};
	console.log($scope.user);

	console.log(socket);

	/*
	 * STEP 1 CLICK TO PLAY
	 */
	// This would be cool to have some sort of "sliding" like and ios feeling
	$scope.showForm = function(){
		console.log('we should hide this and show the form');
		$scope.data.showSignUp = true;
		$scope.data.showWelcomeMessage = false;
	}


	/*
	 * STEP 2 USER SIGNS UP FOR GAME QUE
	 */
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
			});
		}
		
	};
	// After this is submitted we need to show the que

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

	socket.on('alert', function(data){
		alert('this is the post alert')
	})
	
	socket.on('timeToPlay', function(data){
		$scope.data.showGameScreen = true;
		$scope.data.showUserQue = false;
		//alert('WE ARE RUNNING TIME TO PLAY')
	});
	
	socket.on('udpateUserList', function(data){
		console.log('A NEW USER HAS BEEN ADDED');
		
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
}

function StartScreen($scope, $http){


}

function ShowShareScreen($scope, $http){
	// After the user has finsihed the game
	// we want to hide their game screen and show some sort of dropping ball 
	// o with a share button
}