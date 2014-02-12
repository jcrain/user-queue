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
	Que.find({},'name', function(e, doc){
		if(e || !doc) {
			throw res.json({ "userlist": "none"});
		} else {
			res.json({ "userlist" : doc });
		}
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
					// We need to add the suffix the this day, ie st, nd, rd, th
					count = function ordinal_suffix_of(count) {
					    var j = count % 10;
					    if (j == 1 && count != 11) {
					        return count + "st";
					    }
					    if (j == 2 && count != 12) {
					        return count + "nd";
					    }
					    if (j == 3 && count != 13) {
					        return count + "rd";
					    }
					    return count + "th";
					}(count);
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
	// remove the current user from the que
	var player;
	var myCurrentUser = Que.findOne(function(err, doc){
		if (doc != null){
			console.log('this is the the doc is :'+doc);
			io.sockets.socket(doc.socket).emit('showEndScreen', function(){
				console.log('User now sees the end screen');
			});
			if(err || !doc) {
				throw res.json({ "message": "There was an error removeing the user"});
			} else {
				player = doc;
				console.log(player);
				Que.remove( { id : player.id }, function(){
					console.log("we are in the call back from remove");
				});
				// WE SHOULD SHOW THE NEXT PERSON THE GAME SCREEN
				//=================================================
				var myCurrentUser = Que.findOne(function(err, doc){
					if (doc != null){
						io.sockets.socket(doc.socket).emit('timeToPlay', function(){
							console.log('these event is working somewhere');
						});
					} 
				});
				res.send({ "message": "success"});
			}
		} else{
			res.json({ "message" : "fail" });
		}
	});

}

















 