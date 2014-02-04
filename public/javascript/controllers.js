function AddUserForm($scope, $http, socket){
	$scope.data = { message: "hello"};

	$scope.user = {
		'id'	: document.getElementById('user_id').getAttribute("value"), // there is probably a better way to do this
		'name'	: '',
		'email'	: ''
	};

	console.log(socket);

	$scope.addUser = function(){
		var thisUser = $scope.user;
		console.log(thisUser);
		if (thisUser.name.length > 0 && thisUser.email.length > 0 && thisUser.id.length > 0){
			// we need to save the user to the server
			$http.post('/addUser', thisUser).success(function(data, status, headers, config){
				socket.emit('newUser', data.name, function(){
					console.log('we have a new user in the clients brower');
				});

			});
		}
	};
}