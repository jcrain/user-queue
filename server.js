var express = require('express'),
	http 	= require('http'),
	routes 	= require('./routes'),
	path 	= require('path'),
 	fs   	= require('fs'),
 	lessMiddleware = require('less-middleware'),
 	app 	= express(),
 	server 	= http.createServer(app),
 	io 		= require('socket.io').listen(server);



var clients = {};
server.listen(3000);

// Configure app
app.configure(function(){
	app.set('views', path.join(__dirname, 'views'));
	app.set('view engine', 'jade');
	app.use(express.static(path.join(__dirname, 'public')));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(lessMiddleware({ src: __dirname + '/public', force: true, paths: './vendor/twitter/bootstrap/less' }));
});

// get the routes object with property index
app.get('/', routes.index);
app.post('/addUser', routes.addUser);
app.post('/userDone', routes.userDone);

// We will put out event bindings in a controller
io.sockets.on('connection', routes.socketsLogic);
// Get user list

// App Settings


// SOCKET IO STUFF
//=============================================
/*io.on('disconnect', function(){
	console.log('we have lost the connection');
	console.log('lets try to connect in 10 seconsd');
    /*socketConnectTimeInterval = setInterval(function () {
      socket.socket.reconnect();
      if(socket.socket.connected) {
      	clearInterval(socketConnectTimeInterval);
      	console.log('we are reconnected after being disconnected');
      }
    }, 3000);*/
//}); -> uncomment this


/*io.sockets.on('connection', function(socket){
	console.log('this is the session id for this specific socket :' + socket.id);
	socket.emit('yourId', socket.id);
	clients[socket.id] = socket;
	/*setTimeout(function(){
		socket.emit('upNext','this is you\'re message that no one else should see');
	}, 3000);*/

	// handle disconnected socket here we bind events to the socket connection
/*	socket.on('disconnect', function(socket){
		console.log('this shit be hella disconnected');
	});
	socket.on('disClient', function(){
		console.log('we have a DISCONNECTED client with id : ' + socket.id);
	});

	socket.on('saveId', function(data){
		console.log('this is the socket ID i am adding to keep track of sockets: '+data);
	});
});

io.on('youAreUpNext', function(socket){
	console.log('we are in youAreUpNext');
	socket.emit('this should only appear in one browser', {});
});


io.on('reClient', function(socket){
	console.log('RECONNECT biatchhhhh client id: '+ socket.id);
});*/






