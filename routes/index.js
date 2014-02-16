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
	var dateDiff = today.getTime() - launchDay.getTime();
	var dayDiff = Math.ceil(dateDiff / (1000 * 3600 * 24));
	return dayDiff;	
};

var day = getDayObj();
day = 30 - day;


// TURN A QUEUE # INTO ST, ND, RD, TH
//================================================ 
var getPlaceInLine = function(num){
	var j = num % 10;
	if (j == 1 && num != 11) {
	    return num + "st";
	}
	if (j == 2 && num != 12) {
	    return num + "nd";
	}
	if (j == 3 && num != 13) {
	    return num + "rd";
	}
	return num + "th";
};


/*
 * Show the splash screen without the game url
 */ 
exports.splash  = function(req, res){
 	res.render('splash');
 };

// Lemme get an index pageeeee
//================================================
exports.game  = function(req, res) {
		res.render('gameLayout', { daysLeft: day});
		console.log(day);
};

// API to get users in Que
//=================================================
exports.getQue = function(req, res){
	Que.find({}, { name: 1, userHitPlay: 1 }, function(e, doc){
		if(e || !doc) {
			throw res.json({ "userlist": "none"});
		} else {
			res.json({ "userlist" : doc });
		}
		console.log(doc);
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

	var queDoc = { id: reqBody.id, name: reqBody.name, socket: reqBody.id, userHitPlay: false}; // build user doc
	var addQue = new Que(queDoc);
	addQue.save(function(err, doc) { // save user to queue
		if(err || !doc) {
			throw 'Error';
		} else {
			Que.count(function(err, count){ // we need to get the place in line
				if ( count > 1 ){ 
					// We need to add the suffix the this day, ie st, nd, rd, th
					count = getPlaceInLine(count); 
					res.json({ isFirst: false, queNumber: count });
				} else {
					res.json({ isFirst: true });
				}
			});
		}		
	});
};

// Delete User After timeout
//=============================================
exports.removeUserFromQue = function(req, res){
	var myCurrentUser = Que.findOne(function(err, doc){
		player = doc;
		console.log(player);
		Que.remove( { id : player.id }, function(){
			
		});
		// WE SHOULD SHOW THE NEXT PERSON THE GAME SCREEN
		//=================================================
		var myCurrentUser = Que.findOne(function(err, doc){
			if (doc != null){
				io.sockets.socket(doc.socket).emit('timeToPlay', function(){
					console.log('these event is working somewhere');
				});
				res.json({"message": "user deleted from que"});
			} else {
				res.json({"message": "no one is que"});
			}
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
	});

	socket.on('reConnectedSocket', function(data){ // this data is the user.id that was initially set
		var getUser = Que.find({ id : data}, function(err, doc){
			if(err || !doc) {
				// this user needs to have their client side id updated
				socket.emit('updateYourId', socket.id);
				throw 'Error';
			} else {
				// this user  
				Que.update( { id: data }, { socket: socket.id}, function(){
					console.log('this record has been updated');
				});
			}	
		});	
	});

	socket.on('userHitPlay', function(){ // Update record to show the user is ready to play
		var userIsReady = Que.findOne(function(err, doc){
			if (doc != null){
				Que.update( { id: doc.id }, { userHitPlay: true }, function(){
					console.log('this record has been updated to indicated user is ready');
				});
			}
		});
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
};

// API to give the current player the end screen
exports.userFinishedGame = function(req, res){
	var userScore = req.query.score;
	var player;
	var myCurrentUser = Que.findOne(function(err, doc){ // Find the current player and remove them from queue
		if (doc != null){
			io.sockets.socket(doc.socket).emit('showEndScreen', userScore,  function(){
				console.log('User now sees the end screen');
			});
			if(err || !doc) {
				throw res.json({ "message": "There was an error removeing the user"});
			} else {
				player = doc;
				Que.remove( { id : player.id }, function(){});
				res.send({ "message": "success"});
			}
		} else{
			res.json({ "message" : "fail" });
		}
	});

}

// API to show user game screen
exports.displayIsReady = function(req, res){
	var showUserPlayScreen = Que.findOne(function(err, doc){ // Find the next person to play
		/*for (var key in doc) {
  				console.log('here are the keys' + key);
			}*/
		if (doc != null){
			io.sockets.socket(doc.socket).emit('showGameScreen', function(){});
			res.send({ "message": "success"});
		} else{
			res.send({ "message": "fail"});
		}
	});

	var showNextUp = Que.find({}).skip(1).limit(1).select('socket').exec(function(err, doc){ // If we have a 2nd person in the queue they get the up next screen
		if (doc != null){
			doc =JSON.stringify(doc);
			try{
				doc = doc.split(':');
				doc = doc[1].split(',');
				doc = doc[0].replace('"', '').replace('"', '');
			} catch(e){
				console.log(e);
			} finally{

			}
			io.sockets.socket(doc).emit('timeToPlay', function(){});
		}
	});
};

















 