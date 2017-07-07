var express = require("express");
var router = express.Router();
var Photo = require("../models/photos").Photo;
var Camera = require("../models/cameras").Camera;



//busca fotos por idCamera

router.get("/getPhotosByIdCamera/:idCamera",function(req,res){

	Photo.find({"idCamera":req.params.idCamera},function(error,data){

		if (error) {
			res.status(403).json({success:false,message:"Error obteniendo la lista de fotos"});
		}else{
			res.status(200).send(data);
		}

	});

});


router.post("/addPhoto",function(req,res){

	var data = {
		url : req.body.url,
		idCamera : req.body.idCamera,

	}

	var photo = new Photo(data);
	console.log(photo.captured);
	photo.save(function(error){

		if (error) {
			res.status(403).json({success:false,message:"Error agregando la foto"});
		}else{
			//si pudo guardar la foto entonces actualizar el campo lastPhoto en la respectiva cámara
			updateLastPhoto(req,res,photo);


			
		}

	});

});

/*
	Esté método actualiza el campo lastPhoto a la cámara registrada en la foto que se acaba de crear
*/
function updateLastPhoto(req,res,photo){

	Camera.findById(req.body.idCamera,function(error,data){
				if (!error) {
					
					
					
					var da = new Date;
					var dateString = da.toString();

					data.lastPhoto = req.body.url;
					data.lastPhotoDate = photo.captured;

					console.log(data);
					
					data.save(function(error,data){
						if (!error) {
							res.status(200).json({success:true,message:"Se agregó la foto correctamente"});
						}else{
							res.status(403).json({success:false,message:"Error agregando la foto"});
						}
					});
					
				}
			});
}




module.exports = router;

