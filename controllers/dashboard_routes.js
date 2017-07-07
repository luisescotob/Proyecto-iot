var express = require("express");
var router = express.Router();


router.route("/myCameras")
	
	.get(function(req,res){
		res.sendView("myCameras");
	});

router.route("/manageTriggers")
	
	.get(function(req,res){

		res.sendView("manageTriggers");

	});

router.route("/photoRecord")
	
	.get(function(req,res){

		res.sendView("photoRecord");

	});

router.route("/addCamera")
	
	.get(function(req,res){

		res.sendView("addCamera");

	});

router.route("/registerTriggers")

	.get(function(req,res){
		res.sendView("registerTriggers");
	});

router.route("/accountSettings")

	.get(function(req,res){
		res.sendView("accountSettings");
	});

	
router.route("*")

	.get(function(req,res){
		res.sendView("notFound");
	})

module.exports = router;