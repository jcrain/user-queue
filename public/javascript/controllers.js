function AddUserForm($scope, $http, socket){
	$scope.data = { message: "hello"};
	//alert('running add user');

	$scope.user = {
		'id'		: '1234',
		'name'	: '',
		'email'	: ''
	}

	$scope.addUser = function(){
		var thisUser = $scope.user;
		console.log(thisUser);
			console.log('we are in add user');
		if (thisUser.name.length > 0 && thisUser.email.length > 0 && thisUser.id.length > 0){
			console.log('we have valid stuff in the boxes ');

			//var newUser = new User(thisUser);
			/*newUser.$save(function(p, resp){

			});*/
			$http.post('/addUser', thisUser).success(function(data, status, headers, config){
				console.log('are we saving this now?????');
				// Maaaaybe here we can call socket
				socket.emit('newUser', data.name, function(){
					console.log('we have a new user in the clients brower');
				});
			});
		
		}

	};

	
}