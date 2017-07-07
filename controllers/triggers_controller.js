var express = require("express");
var router = express.Router();
var Trigger = require("../models/triggers").Trigger;
var Camera = require("../models/cameras").Camera;

//Busca todas los triggers por idUser

	router.get("/getTriggersByIdUser/:idUser",function(req,res){

		Trigger.find({"idUser":req.params.idUser},function(error,data){
			
			if (error) {
				res.status(403).json({success:false,message:"Error obteniendo lista de triggers"})
			}else{
				res.status(200).send(data);
			}

		});
	});


	//agrega un trigger
	router.post("/addTrigger",function(req,res){
		var data = {

			name: req.body.name,
			idUser: req.body.idUser,
			description: req.body.description,
			uuid: req.body.uuid,
			type: req.body.type
			/////////////////////////////////////////////////////////////

			
		};
		
		//Crea el objeto trigger
		var trigger = new Trigger(data);

		//Guarda el trigger
		trigger.save(function(error,data){
			if (error) {
				res.json({success:false,message:"Error intentando agregar el trigger"})
				console.log(error);
			}else{
				res.status(200).json({success:true,message:"Se agregó el trigger correctamente",tid:trigger._id})
			}
			

		});

	});

	router.delete("/deleteTrigger/:id",function(req,res){
		Trigger.findById(req.params.id,function(error,trigger){
			if (error) {
				res.status(403).json({success:false,message :"Error intentando eliminar trigger"});
			}else{
				if (!trigger) {
					res.end();
				}
			}
		}).then(function(trigger){
			trigger.remove(function(error){
				if (error) {
					res.status(403).json({success:false,message :"Error eliminando trigger"});
				}else{
					console.log(trigger.cameras.length);

					deleteAllCameraRelations(req,res,trigger);

				}
			})
		});
	});

/*
	Cuando se borra un trigger se deben borrar los registros de ese trigger en las camaras que tenía
	asociadas
*/
	function deleteAllCameraRelations(req,res,trigger){
		console.log("entro al metodo");
				if (trigger.cameras.length > 0) {
					console.log("entro al if length");
							for (var i = 0; i < trigger.cameras.length; i++) {
								console.log("entro al for");
								Camera.findById(trigger.cameras[i].idCamera,function(error,camera){
									if (error) {
										console.log("error "+error);
									}else if(!camera){
										console.log("");
									}else if(!error) {
										console.log("entro al ultimo else");
										for (var i = 0; i < camera.triggers.length; i++) {
											console.log("entro al ultimo for");
											if (camera.triggers[i].idTrigger == req.params.id) {
												console.log("entro al if camera id");
												arr = camera.triggers;

												arr.splice(i,1);

												camera.triggers = arr;

												camera.save(function(error){
													if (error) {
														console.log("error desasociando");
														//res.json({success:false,message:"Error desasociando trigger"})
													}else{
														console.log("trigger desasociado correctamente");
														//res.json({success:true,message:"Trigger desasociado correctamente"})
													}
												})
											}
										}

									}
								})

							}

						}

						res.status(200).json({success:true,message:"Trigger eliminado correctamente"});
	}



	router.get("/getTriggerById:/id",function(req,res){
		Trigger.findById(req.params.id,function(error,data){
			if (error) {
				res.status(403).json({success:false,message:"Error eliminando trigger"});
				
			}else{

				res.status(200).send(data);
			}
		});
	});

	router.put("/updateTrigger/:id",function(req,res){
		Trigger.findById(req.params.id,function(error,data){
			if (error) {
				res.status(403).json({success:false,message:"Error intentando actualizar trigger"})
			}else{
				data.name = req.body.name;
				data.description= req.body.description;
				data.uuid= req.body.uuid;
				data.type= req.body.type;

				data.save(function(error,data){
					if (error) {
						res.status(403).json({success:false,message:"Error actualizando trigger"})
					}else{
						res.status(200).json({success:true,message:"Trigger actualizado"})
					}
				});
			}
		});

	});

	router.put("/unattachCamera/:id",function(req,res){
		//:id es el id del trigger
		Trigger.findById(req.params.id,function(error,data){
			if (error) {
				res.status(403).json({succes:false,message:"Error encontrando el trigger"});
			}else{

				var array = data.cameras;

				array.splice(req.body.index,1);

				data.cameras = array;

				data.save(function(error){

					if (error) {
						res.status(403).json({success:false,message:"Error desasociando cámara"});
					}else{
						res.status(200).json({success:true,message:"Cámara desasociada correctamente"});
					}

				});

			}
		});
	});


	router.put("/attachCamera/:id",function(req,res){
		//:id es el id del trigger
		Trigger.findById(req.params.id,function(error,data){
			if (error) {
				res.status(403).json({success:false,message:"Error intentando actualizar cámara"})
			}else{
				
				var camera = {}
				camera.idCamera = req.body.idCamera;
				data.cameras.push(camera);

				data.save(function(error,data){
					if (error) {
						res.status(403).json({success:false,message:"Error asociando cámara"})
					}else{
						res.status(200).json({success:true,message:"cámara asociada"})
					}
				});
			}
		});
	});


module.exports = router;