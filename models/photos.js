var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;

var photo_schema = new Schema({

	url: {
		type:String,
		unique: true,
		index: true,
		required: true

	},

	captured: {
		type: Date,
		default: Date.now
	},

	idCamera : {
		type: ObjectId,
		ref: "Camera",
		required: true
	}

},{collection:"photos"});

var Photo = mongoose.model("Photo",photo_schema);

module.exports.Photo = Photo;