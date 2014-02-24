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
 	lessMw 	= require('less-middleware'),
 	app 	= express(),
 	server 	= http.createServer(app);
 	

// WE NEED THE SOCKET CONNECTION TO BE GLOBAL
//=============================================
io 		= require('socket.io').listen(server);
server.listen(3000);

// SYSTEM WORKING GLOBAL VAR
isSystemOn  = 1;

// CONFIGURE APP 
//=============================================
app.configure(function(){
	app.set('views', path.join(__dirname, 'views'));
	app.set('view engine', 'jade');
	app.use(lessMw({ src: __dirname + '/public', force: true, paths: './vendor/twitter/bootstrap/less' }));
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
app.get('/', routes.splash); // Return splash page
app.get('/game', routes.game); // Return the game
app.get('/getQue', routes.getQue); // Return the users in the queue 
app.get('/userFinishedGame', routes.userFinishedGame); // we need to remove the user from the que and then show the end screen
app.get('/displayIsReady', routes.displayIsReady); // show the user the screen to play the game
app.get('/system', routes.system); // Turn the game on and off
app.get('/watchBall', routes.watchBall);
app.post('/deleteUser', routes.removeUserFromQue); // called when user times out
app.post('/addUser', routes.addUser); // add a user to the que
app.post('/emailCollector', routes.emailCollector);


// We will put out event bindings in a controller
io.sockets.on('connection', routes.socketsLogic);
// Get user list






