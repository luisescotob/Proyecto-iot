var express = require("express");
var router = express.Router();
var Camera = require("../models/cameras").Camera;
var Trigger = require("../models/triggers").Trigger;

//Busca todas las camaras por idUser

	router.get("/getCamerasByIdUser/:idUser",function(req,res){

		Camera.find({"idUser":req.params.idUser},function(error,data){
			
			if (error) {
				res.status(403).json({success:false,message:"Error obteniendo lista de cámaras"})
			}else{
				res.status(200).send(data);
			}

		});
	});


	//agrega una cámara
	router.post("/addCamera",function(req,res){
		var data = {

			name: req.body.name,
			idUser: req.body.idUser,
			/////////////////////////////////////////////////////////////

			triggers: req.body.triggers
		};

		//Crea el objeto camara
		var camera = new Camera(data);

		//Guarda la cámara
		camera.save(function(error,data){
			if (error) {
				res.status(403).json({success:false,message:"Error intentando agregar la cámara"})
			}else{
				res.status(200).json({success:true,message:"Se agregó la cámara correctamente"})
			}
			

		});

	});
//unattach trigger
	router.put("/unattachTrigger/:id",function(req,res){
		//:id es el id de la cámara
		Camera.findById(req.params.id,function(error,data){
			if (error) {
				res.status(403).json({succes:false,message:"Error encontrando los triggers"});
			}else{

				var idTrigger = data.triggers[req.body.index].idTrigger;
				var idCamera = data._id;

				data.triggers.splice(req.body.index,1);

				data.save(function(error){

					if (error) {
						res.status(403).json({success:false,message:"Error desasociando trigger"});
					}else{

						removeCameraRelationInTrigger(idTrigger,idCamera,res);
						
					}

				});

			}
		});
	});

function removeCameraRelationInTrigger(idTrigger,idCam,res){

	Trigger.findById(idTrigger,function(error,data){

		if (error) {
			console.log("Error intentando desasociar cámara a trigger");
			return res.status(403).json({success:false,message:"Error intentando desasociar trigger a cámara"})
		}else{

			
			console.log("idcam");
			console.log(idCam);

			console.log("el 0");
			console.log(data.cameras[0].idCamera);
			console.log("alavergaaaaaaaaaa");
			

			for (var i = 0; i < data.cameras.length; i++) {

				if (data.cameras[i].idCamera.toString() == idCam.toString()) {
					console.log("si hay una igual");
					data.cameras.splice(i,1);
				}
			}

			data.save(function(error){

				if (error) {
					console.log("Error desasociando cámara a trigger");
					return res.status(403).json({success:false,message:"Error desasociando trigger a cámara"})
				}else{
					console.log("Cámara desasociada a trigger correctamente");
					return res.status(200).json({success:true,message:"Trigger desasociado correctamente"})
				}
			})
		}

	})



}
	

	router.get("/getCameraById/:id",function(req,res){
		Camera.findById(req.params.id,function(error,data){
			if (!error) {
				res.status(200).send(data);
			}
		});
	});

	router.put("/attachTrigger/:id",function(req,res){
		var trigger={}
		Camera.findById(req.params.id,function(error,camera){
			if (error) {
				res.status(403).json({success:false,message:"Error intentando asociar trigger a cámara"})
			}else{
				
				trigger.idTrigger = req.body._id
				trigger.name = req.body.name
				trigger.type = req.body.type


				for (var i = 0; i < camera.triggers.length; i++) {
					if (camera.triggers[i].idTrigger == trigger.idTrigger) {
						return res.json({success:false,message:"Error, la cámara que seleccionaste ya tiene asociado ese trigger"});


					}
				}
				

				camera.triggers.push(trigger);

				camera.save(function(error){
					if (error) {
						res.status(403).json({success:false,message:"Error asociando trigger a cámara"})
					}else{

						addCameraRelationInTrigger(trigger.idTrigger,camera._id,res);

					}
				});
			}
		});

	});

function addCameraRelationInTrigger(idTrigger,idCamera,res){

	Trigger.findById(idTrigger,function(error,data){

		if (error) {
			console.log("Error intentando asociar cámara a trigger");
			return res.status(200).json({success:true,message:"Error intentando asociar trigger a cámara"})
		}else{

			var cam = {}
			cam.idCamera = idCamera;
			data.cameras.push(cam);
			data.save(function(error){
				if (error) {
					console.log("Error asociando cámara a trigger");
					console.log(error);
					return res.status(403).json({success:false,message:"Error asociando trigger a cámara"})
				}else{
					console.log("Cámara asociada a trigger correctamente");
					return res.status(200).json({success:true,message:"Trigger asociado correctamente"})
				}
			})
		}

	})

}




	router.delete("/deleteCamera/:id",function(req,res){
		Camera.findById(req.params.id,function(error,camera){
			if (error) {
				res.status(403).json({success:false,message:"Error intentando borrar cámara"})
			}else{
				if (!camera) {
					res.end();
				}
			}
		}).then(function(camera){
			camera.remove(function(error){
				if (error) {
					res.status(403).json({success:false,message:"Error borrando cámara"})
				}else{

					deleteAllTriggerRelations(req,res,camera);
					
				}
			})
		});
	});


/*
	Cuando se borra una cámara se deben borrar los registros de esa cámara en los triggers que tenía
	asociados
*/
function deleteAllTriggerRelations(req,res,camera){
	console.log("entro al metodo");
			if (camera.triggers.length > 0) {
				console.log("entro al if length");
						for (var i = 0; i < camera.triggers.length; i++) {
							console.log("entro al for");
							Trigger.findById(camera.triggers[i].idTrigger,function(error,trigger){
								if (error) {
									console.log("error "+error);
								}else {
									console.log("entro al ultimo else");
									for (var i = 0; i < trigger.cameras.length; i++) {
										console.log("entro al ultimo for");
										if (trigger.cameras[i].idCamera == req.params.id) {
											console.log("entro al if trigger .idCamera");
											arr = trigger.cameras;

											arr.splice(i,1);

											trigger.cameras = arr;

											trigger.save(function(error){
												if (error) {
													console.log("error desasociando triggers al eliminar cámara");
													//res.json({success:false,message:"Error desasociando trigger"})
												}else{
													console.log("cámara desasociado en triggers correctamente");
													//res.json({success:true,message:"Trigger desasociado correctamente"})
												}
											})
										}
									}

								}
							})

						}

					}

					res.status(200).json({success:true,message:"Cámara eliminada correctamente"});
}


module.exports = router;