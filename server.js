/* Application: Window Display User Que
 * Company: MRY
 * Tech Stack: Node, Express, MongoDB, Socket.io
 */

var express = require('express'),
	http 	= require('http'),
	routes 	= require('./routes'),
	path 	= require('path'),
 	fs   	= require('fs'),
 	lessMiddleware = require('less-middleware'),
 	app 	= express(),
 	server 	= http.createServer(app);
 	

io 		= require('socket.io').listen(server);
openConnections = {}; // This did not work when exported from index.js



var clients = {};
server.listen(3000);

// Configure app
app.configure(function(){
	app.set('views', path.join(__dirname, 'views'));
	app.set('view engine', 'jade');
	app.use(lessMiddleware({ src: __dirname + '/public', force: true, paths: './vendor/twitter/bootstrap/less' }));
	app.use(express.static(path.join(__dirname, '/public')));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
});

// get the routes object with property index
app.get('/', routes.index);
app.get('/getQue', routes.getQue);
app.get('/deleteUser', routes.removeUserFromQue); // this will likely be for timeouts 
app.get('/userFinishedGame', routes.userFinishedGame); // we need to remove the user from the que and then show the end screen
app.get('/userTimedOut', routes.userTimedOut);
app.get('/socketShowGameScreen', routes.socketShowGameScreen);
app.post('/addUser', routes.addUser);

// We will put out event bindings in a controller
io.sockets.on('connection', routes.socketsLogic);
// Get user list






