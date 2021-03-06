// Mongo DB stuff 
//=============================================
var mongoose = require('mongoose');


// Connect to our DB
//var Schema 		= mongoose.Schema;

exports.NewUser = new mongoose.Schema({
		id		: { type: String, required: true },
		name	: { type: String, required: true },
		email	: { type: String, required: true }
});

exports.QueUser = new mongoose.Schema ({
	id				: { type: String, required: true },
	name			: { type: String, required: true },
	socket			: { type: String, required: true },
	userHitPlay 	: { type: Boolean, required: true },
	timestampAdded	: { type: String, required: true}
});