var express = require("express");
var router = express.Router();
var path = require("path");

//folder estático donde están los archivos html,css,scripts,img
router.use(express.static((path.join(__dirname, '../views/'))));

router.use(function(req,res,next){

	res.sendView = function(view){
		//if folder contains view entonces return esto .. else return pagina de recurso 
		//se ha movido o no existe
		
		return res.sendFile(path.join(__dirname,"../views/"+view+".html"));
		
	}

	next();
});

module.exports = router;