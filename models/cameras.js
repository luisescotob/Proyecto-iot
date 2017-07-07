var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

//se crea el schema para las cámaras
var camera_schema = new Schema({

	name : {
		type: String,
		required: true,
	},

	lastPhoto : {
		type: String,
		default: "http://placehold.it/350x250"
	},

	lastPhotoDate:{
		type:Date,
		
		
	},

	created:{
		type:Date,
		default:Date.now
	},

	idUser : {
		type: ObjectId,
		ref: "User",
		required: true
	},

	triggers: [{

		idTrigger : {
			type: ObjectId,
			ref: "Trigger",

		},

		name:{
			type:String,
		},
		type: {
			type: String,
			enum: ["movement sensor","dog"],
		}


	}]
},
{collection:"cameras"});

var Camera = mongoose.model("Camera",camera_schema);

module.exports.Camera = Camera;
