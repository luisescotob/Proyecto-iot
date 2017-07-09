var express = require("express");
var router = express.Router();
var jwt = require("jsonwebtoken");
var User = require("../models/users").User;
var Camera = require("../models/cameras").Camera;
var Trigger = require("../models/triggers").Trigger;
var config = require("../config");
var request = require("request");

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

/*
	ruta pública para que los triggers notifiquen a las cámaras cuando se activen o para cuando el usuario
	presione el botón "capture" de la plataforma web
*/

router.post("/notify",function(req,res){
	var cams = "";

	//el req.body.uuid es cuando es desde el trigger y el req.body.idCamera es cuando es desde la plataforma
	if (req.body.uuid != undefined) {

		Trigger.findOne({uuid:req.body.uuid},function(error,trigger){

			if (error) {
				res.end();
			}else if(!trigger){
				res.end();
			}

		}).then(function(trigger){


			for (var i = 0; i < trigger.cameras.length; i++) {

				Camera.findOne({_id:trigger.cameras[i].idCamera},function(error,camera){
					if (error) {
						res.end();
					}else if(!camera){
						res.end();
					}
				}).then(function(camera){

					//AQUI VA LA LÓGICA DE NOTIFICACIONES PUSH 

					cams = cams+camera.name+", ";
				});
				
			}

			User.findOne({_id:trigger.idUser},function(error,user){
				if (error) {
					res.end();
				}else if(!user){
					res.end();
				}
			}).then(function(user){
				console.log("entro al sendtext");
				sendText("Tu trigger "+trigger.name+" se ha activado y ha hecho que las cámaras "+cams+"se preparen para capturar una foto, checalas!",user.fbId);
				res.end();
			});
			

		});

	}else if (req.body.idCamera != undefined){

		Camera.findOne({_id:req.body.idCamera},function(error,camera){
			if (error) {
				res.end();
			}else if(!camera){
				res.end();
			}


		}).then(function(camera){

			User.findOne({_id:camera.idUser},function(error,user){
				if (error) {
					res.end();
				}else if(!user){
					res.end();
				}
			}).then(function(user){

				sendText("Activaste desde la plataforma la cámara "+camera.name,user.fbId);
				//AQUÍ VA LA LÓGICA DE NOTIFICACIONES PUSH

			});
			

		});

	}

});

function sendText(message,sender){
	let messageData = {text:message};

	sendRequest(messageData,sender);
	
}

function sendRequest(messageData,sender){
	//token unico de la pagina de facebook
const token = "EAASo1dz4X1gBAKPhsZCf8b9pnSecpphbgDYHqePbJx9UdmgKBKDtwOsPhO3dmXuLdePZBJLWM2VsBIY7wWUgviat6MYN3DDZBP0g7tDh2voRuzR9mms4HyAUTyUUzmj1L0Odc4ZAGWyJ8uusK0voTXQeZCrsiRY2EinssgLaDGQZDZD"
	request({
      url: 'https://graph.facebook.com/v2.6/me/messages',
      qs: {access_token: token},
      method: 'POST',
      json: {
        recipient: {id: sender},
        message: messageData,
      }
    }, (error, response) => {
      if (error) {
          console.log('Error sending message: ', error);
      } else if (response.body.error) {
          console.log('Error en la request: ', response.body.error);
          console.log(messageData);
      }
    });
}

module.exports = router;

