function AddUserForm($scope, $http){
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
			$http.post('/addUser', thisUser, function(){
				console.log('are we saving this now?????');

			});
		
		}

	};
}