var express = require("express");
var router = express.Router();
var User = require("../models/users").User;

//localhost:8080

	//trae la lista de usuarios
	router.get("/getAllUsers",function(req,res){
		User.find(function(error,data){
			if (error) {
				res.status(403).json({success:false,message :"Error encontrando la lista de usuarios"});
			}else{
				res.status(200).send(data);
			}
		});

	});

	//crear usuario --> se maneja en el index porque todos pueden crear usuarios 
	//osea registrarse
	
	router.get("/getUserById/:id",function(req,res){
		User.findById(req.params.id,function(error,data){
			if (error) {
				
				res.status(403).json({success:false,message :"Error encontrando usuario"});
			}else{
				res.status(200).send(data);
			}
		});
	});



	router.put("/updateUser/:id",function(req,res){
		User.findById(req.params.id,function(error,data){
			if (error) {
				res.status(403).json({success:false,message :"Error intentando actualizar usuario"});
			}else{
				

				data.username = req.body.username;
				data.password = req.body.password;
				data.email = req.body.email;
				data.fbId = req.body.fbId;
				data.systemStatus = req.body.systemStatus;

				data.save(function(error){
					if (error) {
						res.status(403).json({success:false,message :"Error actualizando usuario"});
					}else{
						res.status(200).json({success:true,message:"Usuario actualizado correctamente"})
					}
				});
			}
		});
	});

	router.delete("/deleteUser/:id",function(req,res){
		User.findById(req.params.id,function(error,data){
			if (error) {
				res.status(403).json({success:false,message :"Error intentando eliminar usuario"});
			}else{
				if (!data) {
					res.end();
				}
			}
		}).then(function(data){
			data.remove(function(error){
				if (error) {
					res.status(403).json({success:false,message :"Error eliminando usuario"});
				}else{
					res.status(200).json({success:true,message:"Usuario eliminado correctamente"})
				}
			})
		});
	});

module.exports = router;
	
