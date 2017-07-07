var express = require("express");
var router = express.Router();
var jwt = require("jsonwebtoken");
var config = require("../config");

router.use(function(req,res,next){

	var token = req.body.token || req.query.token || req.headers["x-access-token"];

	//decode token
	if (token) {

		//se verifica usando el secret
		jwt.verify(token,config.secret,function(error,decoded){

			if (error) {
				return res.sendView("noAccess");
				next();
			}else{
				//si todo esta bien el token se guarda en la request para su uso en otras rutas

				req.decoded = decoded;
				next();
			}

		});
	}else{

		//si no hay token se devuelve un error
		return res.sendView("noAccess");
		next();
	}

});

module.exports = router;