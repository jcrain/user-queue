/* 
 * Connect to MongoDB using Mongoose
 */
var mongoose = require('mongoose');
var db;
if (process.env.VCAP_SERVICES) {
   var env = JSON.parse(process.env.VCAP_SERVICES);
   db = mongoose.createConnection(env['mongodb-2.2'][0].credentials.url);
} else {
   db = mongoose.createConnection('localhost', 'newUser');
}

// Get User schema and model so we can query data
//================================================
var NewUser = require('../models/User.js').NewUser; // get our schema
var User 	= db.model('users', NewUser); // get the data that should be based on the schema 

// Get User schema and model to save the Que user
var QueUser = require('../models/User.js').QueUser; // get our schema
var Que 	= db.model('que', QueUser); 



// Set up date object to have a date count down
//=================================================
var launchDay = new Date('Feburary 1, 2014 00:00:00');

var getDayObj = function(){
	var today = new Date();
	today.setHours(0, 0, 0, 0);
	// TODO: just calculate how many days since launch day have passed then
	var dateDiff = today.getTime() - launchDay.getTime();
	var dayDiff = Math.ceil(dateDiff / (1000 * 3600 * 24));
	return dayDiff;	
};

var day = getDayObj();
day = 30 - day;

// Lemme get an index pageeeee
//================================================
exports.index  = function(req, res) {
		res.render('index', { daysLeft: day});
		console.log(day);
};

// API to get users in Que
//=================================================
exports.getQue = function(req, res){
	User.find({},'name', function(e, docs){
		res.json({ "userlist" : docs });
	});
};

// API to save user to database
//=================================================
exports.addUser = function(req, res){
	var reqBody = req.body;
	if (!req.body.isPlayingAgain){ // if we are playing for the first time save to both DBs
		var userObj = {id: reqBody.id, name: reqBody.name, email: reqBody.email};
		var user = new User(userObj); // Lets save a new user to the DB :D
		user.save(function(err, doc) { // Add user to users collection
			if(err || !doc) {
				throw 'Error';
			} else {
				//res.json(doc);
			}		
		});
	} 
	// We also need to save the user to the db for the que
	var queDoc = { id: reqBody.id, name: reqBody.name, socket: reqBody.id };
	var addQue = new Que(queDoc);
	// Save poll to DB with all users
	addQue.save(function(err, doc) {
		if(err || !doc) {
			throw 'Error';
		} else {
			Que.count(function(err, count){
				console.log(count);
				if ( count > 1 ){ 
					res.json({ isFirst: false, queNumber: count });
				} else {
					res.json({ isFirst: true });
				}
			});
			//res.json(doc);
		}		
	});
};

// Delete User End Point 
exports.removeUserFromQue = function(req, res){
	var myCurrentUser = Que.findOne(function(err, doc){
		player = doc;
		console.log(player);
		Que.remove( { id : player.id }, function(){
			res.json({"message": "Your delinquent ass is being removed. suckit."});
		});
	});
};

//exports.openConnections = {};

exports.socketsLogic = function(socket){
	// SOCKET STUFF
	socket.emit('yourId', socket.id);

	// Tell everyone when someone new signs up
	socket.on('newUserAdded', function(data){
		socket.broadcast.emit('addUserToQue', data);
		console.log('SERVERSIDE: New user being fired');
	})

	// handle disconnected socket here we bind events to the socket connection
	socket.on('disconnect', function(socket){
		console.log('this shit be hella disconnected');
	});

	socket.on('disClient', function(){
		console.log('we have a DISCONNECTED client with id : ' + socket.id);
	});

	socket.on('saveId', function(data){
		console.log('this is the socket ID i am adding to keep track of sockets: ' + data);
	});

	// After saving the user we will trigger a new user event on the client side and let 
	// everyone else know that there is a new user
	socket.on('newUser', function(data){
		console.log('NEW USER EVENT');
		socket.broadcast.emit('updateUserList',data, function(){
			console.log('We have a mew user and it is :' + data);
		});
	});

	//exports.openConnections[socket.id] = socket;
	openConnections[socket.id] = socket;
	console.log(openConnections[socket.id]);
};

exports.socketShowGameScreen = function(req, res, next){
	// get the next socket id who is up
	// send them the event to show the running gif
	var myCurrentUser = Que.findOne(function(err, doc){
		console.log('SOCKET ID FOR SHOW RUNNING SCREEN ' + doc.socket);
		console.log(doc.socket);
		//console.log(openConnections);
		//console.log(openConnections[doc.socket]);
		//socket(openConnections[doc.socket]).emit('timeToPlay', {thing: "asdfsdaf"});
		//socket.broadcast.emit('timeToPlay');
		//console.log(socket);
		io.sockets.socket(doc.socket).emit('timeToPlay', function(){
			console.log('these event is working somewhere');
		});
	});
	res.send({ message: "success"});

}

// API to give the current player the end screen
exports.userFinishedGame = function(req, res){
	// remove the current user from the que
	var player;
	var myCurrentUser = Que.findOne(function(err, doc){
		console.log('SOCKET ID FOR SHOW RUNNING SCREEN ' + doc.socket);
		//console.log(doc.socket);

		io.sockets.socket(doc.socket).emit('showEndScreen', function(){
			console.log('these event is working somewhere');
		});
		//console.log(doc);
		player = doc;
		console.log(player);
		Que.remove( { id : player.id }, function(){
			console.log("we are in the call back from remove");
		});
	});
	res.send({ message: "a user was delted"});
}

/*exports.userTimedOut = function(req, res){
	// Show user the time out message
	// remove them from the que list
	// 
};*/

















 