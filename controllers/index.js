var express = require("express");
var router = express.Router();
var jwt = require("jsonwebtoken");
var User = require("../models/users").User;
var config = require("../config");

//incluir las rutas privadas 
//rutas de la API REST de usuarios
router.use("/api/users",require("./users_controller"));
//rutas de la API REST de cámaras
router.use("/api/cameras",require("./cameras_controller"));
//rutas de la API REST de fotos
router.use("/api/photos",require("./photos_controller"));
//rutas de la API REST de triggers
router.use("/api/triggers",require("./triggers_controller"));
//rutas para el chatbot
router.use("/bot/chatbot/998877665544332211",require("./chatbot"));
//rutas privadas que sirven HTML
router.use("/dashboard",require("./dashboard_routes"));


//incluir las rutas publicas
//página principal lleva al login
router.get("/",function(req,res){

	res.sendView("login");

});

//rutas públicas
router.get("/login",function(req,res){
	res.sendView("login");

});

router.get("/signup",function(req,res){

	res.sendView("signup");

});

router.get("*",function(req,res){
	res.sendView("notFound");
});

//ruta pública para el registro de usuarios nuevos
router.post("/signup",function(req,res){
	//obtiene la información de la request
	var data = {

	name: req.body.name,
	lastName: req.body.lastName,
	username: req.body.username,
	email: req.body.email,
	password: req.body.password,
	fbId: req.body.fbId
	

	};

	//Crea el objeto usuario
	var user = new User(data);

	//Guarda el usuario
	user.save(function(error,data){
		if (error) {
			res.status(403).json({success:false,message :"Error en el registro"});
		}else{
			res.status(200).json({sucess:true,message: "Usuario creado"});
		}
	});
});

//ruta pública para el login de los usuarios
router.post("/login",function(req,res){

	User.findOne({
		username: req.body.username
	}, function(error,user){
		if (error) {
			res.json({success:false,message: "Error de autenticación"});
		}

		if (!user) {
			res.json({success:false,message:"Falló la autenticación. Usuario o contraseña no correctos"});

		}else if (user){

			//Checa que la password coincida
			if (user.password != req.body.password) {
				res.json({success:false,message:"Falló la autenticación. Usuario o contraseña no correctos"});
			}else{

				//si el usuario se encuentra y la password coincide
				//Crea un token
				var token = jwt.sign(user,config.secret,{

					//expira en 24 horas
					expiresIn: "24h"

				});

				//Regresa la información en JSON incluyendo el token
				res.json({
					success:true,
					message: "Autenticación completada correctamente",
					token:token,
					idUser:user._id
				});


			}


		}

	});

});

module.exports = router;

