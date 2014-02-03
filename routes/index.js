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

User.find({}, 'name', function(error, polls) {
		if(error){ throw error; }
		console.log('this is the polls results '+polls);
	});

// Main application view
/*exports.index = function(req, res) {
	res.render('index');
	console.log('here is the socket call back in index');
};*/

/*exports.index = function(db){
	return function(req, res) {
		var collection = db.get('usercollection');
		collection.find({}, {}, function(e, docs){
			res.render('index');
			console.log('here is the socket call back in index');
		});
	};
};*/
 
exports.index  = function(req, res) {
	User.find({},'name', function(e, docs){
		console.log("this is returning nothing! " +docs);
		res.render('index', {
			"userlist": docs
		});
		console.log('here is the socket call back in index');
	});

	
};

// API to save user to database
exports.addUser = function(req, res){
	// get the users details
	// save them to db
	// update all screens connected
	console.log(req.body.id);


	var reqBody = req.body,
			// Build up poll object to save
			userObj = {id: reqBody.id, name: reqBody.name, email: reqBody.email};
	//console.log(reqBody.id);
				
	// Create poll model from built up poll object
	var user = new User(userObj);
	
	// Save poll to DB
	user.save(function(err, doc) {
		if(err || !doc) {
			throw 'Error';
		} else {
			res.json(doc);
			/*socket.emit('newUser', reqBody.name, function(){
				console.log('we have a new user in the clients brower');
			});*/
		}		
	});
};

exports.userDone = function(req, res){
	// remove the current user from the Que
	// give the current user the last screen with the share button
	// update all screens connected with the new que
};






















 