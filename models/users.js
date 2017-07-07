//se necesita mongoose para definir un modelo
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

//se crea el schema
var user_Schema = new Schema({

	name : {
		type: String,
		required: true

	},

	lastName: {
		type: String,
		required: true
	},

	username : {
		type: String,
		required: true,
		unique: true,
		index: true
	},

	email : {
		type: String,
		required: true,
		unique: true,
		index:true
	},


	password : {
		type: String,
		required: true
	},

	fbId : {
		type: String, 
		default: ""

	},

	systemStatus:{
		type: String,
		default:"ON"
	},

	created : {
		type: Date,
		default: Date.now
	}

	

},
{collection:"users"});

var User = mongoose.model("User",user_Schema);

module.exports.User = User;

