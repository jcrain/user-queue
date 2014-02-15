/* 
 * Application: Colon-A-Tron
 * Company: MRY
 * Client: Colon Cancer Challenge Foundation
 * 
 */

// INIT REQUIRED NODE MODULES
//==============================================
var express = require('express'),
	http 	= require('http'),
	routes 	= require('./routes'),
	path 	= require('path'),
 	fs   	= require('fs'),
 	lessMiddleware = require('less-middleware'),
 	app 	= express(),
 	server 	= http.createServer(app);
 	

// WE NEED THE SOCKET CONNECTION TO BE GLOBAL
//=============================================
io 		= require('socket.io').listen(server);
server.listen(3000);

// CONFIGURE APP 
//=============================================
app.configure(function(){
	app.set('views', path.join(__dirname, 'views'));
	app.set('view engine', 'jade');
	app.use(lessMiddleware({ src: __dirname + '/public', force: true, paths: './vendor/twitter/bootstrap/less' }));
	app.use(express.static(path.join(__dirname, '/public')));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	//app.use(redirectUnmatched);
});

// SHOW THE SPLASH PAGE FOR INVALID REQ
//=============================================
function redirectUnmatched(req, res) {
  res.redirect("http://198.154.216.198/");
}

// APP ROUTES
//============================================= 
app.get('/', routes.splash);
app.get('/game', routes.game);
app.get('/getQue', routes.getQue); // return the user in the que for the game and if they have hit the "play" button
//app.post('/deleteUser', routes.removeUserFromQue); // this will likely be for timeouts 
app.get('/userFinishedGame', routes.userFinishedGame); // we need to remove the user from the que and then show the end screen
app.get('/displayIsReady', routes.displayIsReady); // show the user the screen to play the game
app.post('/addUser', routes.addUser); // add a user to the que

// We will put out event bindings in a controller
io.sockets.on('connection', routes.socketsLogic);
// Get user list






