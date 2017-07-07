var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

//se crea el schema para los triggers
var trigger_schema = new Schema({

	name : {
		type: String,
		required: true,
	},

	description : {
		type: String,
		default:"",
		required:true,
	},

	type: {
		type: String,
		enum: ["movement sensor","dog"],
		//required: true
	},

	uuid:{
		type:String,
		required:true,
		unique:true,
		index:true

	},

	idUser : {
		type: ObjectId,
		ref: "User",
		required: true
	},

	cameras: [{

		idCamera:{
			type:ObjectId,
			ref:"Camera",
			
		},

		test:{
			type:String,
			default:""
		}


	}]
},
{collection:"triggers"});

var Trigger = mongoose.model("Trigger",trigger_schema);

module.exports.Trigger = Trigger;