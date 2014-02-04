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
	User.find({},'name', function(e, docs){
		res.render('index', {
			"userlist": docs
		});
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

	// We also need to save the user to the db for the que
	var queDoc = { id: reqBody.id, name: reqBody.name };
	var addQue = new Que(queDoc);
	// Save poll to DB with all users
	addQue.save(function(err, doc) {
		if(err || !doc) {
			throw 'Error';
		} else {
			res.json(doc);
		}		
	});

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



exports.socketsLogic = function(socket){
	// SOCKET STUFF
	socket.emit('yourId', socket.id);
	

	// handle disconnected socket here we bind events to the socket connection
	socket.on('disconnect', function(socket){
		console.log('this shit be hella disconnected');
	});

	socket.on('disClient', function(){
		console.log('we have a DISCONNECTED client with id : ' + socket.id);
	});

	socket.on('saveId', function(data){
		console.log('this is the socket ID i am adding to keep track of sockets: '+data);
	});

	// After saving the user we will trigger a new user event on the client side and let 
	// everyone else know that there is a new user
	socket.on('newUser', function(data){
		console.log('NEW USER EVENT');
		socket.broadcast.emit('updateUserList',data, function(){
			console.log('We have a mew user and it is :'+data);
		});
	});
};




















 