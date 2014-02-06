// Connect to MongoDB using Mongoose
var mongoose = require('mongoose');
var db;
if (process.env.VCAP_SERVICES) {
   var env = JSON.parse(process.env.VCAP_SERVICES);
   db = mongoose.createConnection(env['mongodb-2.2'][0].credentials.url);
} else {
   db = mongoose.createConnection('localhost', 'newUser');
}

// Get User schema and model so we can query data
var NewUser = require('../models/User.js').NewUser; // get our schema
var User = db.model('users', NewUser); // get the data that should be based on the schema 

// Get User schema and model to save the Que user
var QueUser = require('../models/User.js').QueUser; // get our schema
var Que = db.model('que', QueUser); 

exports.index  = function(req, res) {
		res.render('index');
};

// API to get users in Que
exports.getQue = function(req, res){
	User.find({},'name', function(e, docs){
		res.json({ "userlist" : docs });
	});
};

// API to save user to database
exports.addUser = function(req, res){
	// get the users details
	var reqBody = req.body,
			// Build up poll object to save
			userObj = {id: reqBody.id, name: reqBody.name, email: reqBody.email};
	// Create poll model from built up poll object
	var user = new User(userObj);
	// Save poll to DB with all users
	user.save(function(err, doc) {
		if(err || !doc) {
			throw 'Error';
		} else {
			res.json(doc);
		}		
	});

	console.log('this is how many we have in our que: ' + Que.find('name').count());

	// We also need to save the user to the db for the que
	var queDoc = { id: reqBody.id, name: reqBody.name, socket: reqBody.id };
	var addQue = new Que(queDoc);
	// Save poll to DB with all users
	addQue.save(function(err, doc) {
		if(err || !doc) {
			throw 'Error';
		} else {
			res.json(doc);
		}		
	});

	// Update The user's list of people and tell everyone else

	// TODO:
	// -> add check to see if this is the first person to sign up 
	// -> If is it the first person we need to get the server to update this
	//    users screen
};

// Remove certain user from Que list
exports.removeUserFromQue = function(req, res){
	console.log('REMOVE DAT BIATCH');
	// remove the current user from the Que
	var user = req.query.id;
	Que.remove({id: user}, function(err, docs){
		console.log(docs);
		res.send('So fucking removed!');
	});
	// give the current user the last screen with the share button
	// update all screens connected with the new que
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

exports.socketShowGameScreen = function(socket){
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
	
}


exports.userFinishedGame = function(req, res){
	// remove the current user from the que
	console.log(globalNess);
	Que.find({}, {"id":currentUser}, function(err, docs){
		console.log('this is the socket connection :' + docs.socket);
	});
}

exports.getNextUser = function(req, res){

};

















 