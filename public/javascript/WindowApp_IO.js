var host = location.host.split(':');

var socket = io.connect('http://'+host[0]+':3000/');
//var socket = io.connect('http://localhost:8080/');
console.log(socket);

var userId;


socket.on('yourId', function(data){
	alert(data);
	// we get our id here
	userId = data;
	socket.emit('saveId', userId);
	// 
	/*setTimeout(function(){
		console.log('we should have a disconnected socket');
		socket.disconnect();
	}, 9000);*/
});

socket.on('upNext', function(data){
	console.log(data);
});

socket.on('newUser', function(data){
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