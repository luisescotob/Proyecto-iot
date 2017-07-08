var express = require("express");
var router = express.Router();
var Camera = require("../models/cameras").Camera;
var User = require("../models/users").User;
var request = require("request"); // <---->
var apiaiApp = require("apiai")("5762a6ca2c0241e2a9f2e0f38b1f9700"); // Cliente Access Token de API.ai

//token unico de la pagina de facebook
const token = "EAASo1dz4X1gBAKPhsZCf8b9pnSecpphbgDYHqePbJx9UdmgKBKDtwOsPhO3dmXuLdePZBJLWM2VsBIY7wWUgviat6MYN3DDZBP0g7tDh2voRuzR9mms4HyAUTyUUzmj1L0Odc4ZAGWyJ8uusK0voTXQeZCrsiRY2EinssgLaDGQZDZD"

//localhost:8080
router.route("/")

	.get(function(req,res){
		res.json({
			message: "Hola!!, soy el chatbot"
		});
		res.end();
	})


	//Facebook
	router.route("/webhook/")
	.get(function(req,res){
		if (req.query["hub.verify_token"] === "eellttookkeenn") {
			res.send(req.query["hub.challenge"]);
		}else{
			res.send("Wrong token");
		}
	})

	.post(function(req, res) {
	  

	  if (req.body.object === 'page') {
	  	
	    req.body.entry.forEach((entry) => {
	      entry.messaging.forEach((event) => {
	        if (event.message && event.message.text) {

	        	User.find({"fbId":event.sender.id},function(error,user){
	        		
	        		if (error) {
	        			sendText();
	        		}else if(user[0] == undefined){
	        			sendText("Asocia tu cuenta al bot actualizando tu Facebook ID en la página http://secur-iot.herokuapp.com/dashboard/accountSettings con este dato: "
	        				+event.sender.id,event.sender.id);
	        		}else{
	        			sendMessage(event);
	        		}

	        	});

	        	

	        }else if (event.postback && event.postback.payload){
	        	payload = event.postback.payload;

	        	
	        	
	        	sendText("Esta es la ultima foto registrada de la cámara seleccionada",event.sender.id);
	        	sendImage(event.sender.id,payload);
	        	

	        }



	      });
	    });
	    res.status(200).end();
	  }
	});


function sendMessage(event){

	let sender = event.sender.id;
	let text = event.message.text;
	let messageData = {};

	let apiai = apiaiApp.textRequest(text,{
		sessionId: "sessionId"
	});

	apiai.on('response', (response) => {
  	let aiText = response.result.fulfillment.speech; 


	  	if (response.result.action === "cameraList") {
	  		sendText(aiText,sender);
	  		sendText("Esta es la lista de tus cámaras registradas, selecciona la cámara que desees activar y recibirás una foto a tiempo real",sender);
	  		sendCameraList(aiText,sender)


	  	}else{
	  		sendText(aiText,sender)
	  	}

  	
  	

  		

  	


 });

	apiai.on("error",(error) =>{
		console.log(error);
	});

	apiai.end();

}

function sendCameraList(aiText,sender){
	let buttons = [];
	let elements = [];
	let button;
	let element;

	User.find({"fbId":sender},function(error,user){

		if (error) {
			sendText("Ocurrio un error, intenta de nuevo mas tarde",sender);


		}else{

			Camera.find({"idUser":user[0]._id},function(error,cameras){

				if (error) {
					console.log(error);
				}else{
					
					if (cameras.length > 0) {

						for (var i = 0; i < cameras.length; i++) {
							button = {};
							button.type="postback";
							button.title=cameras[i].name;
							button.payload=cameras[i].lastPhoto;
							buttons.push(button);
						}

						buttonsRemaining = true
						buttonCount = 0
						

						for (var i = 0; i < 10 && buttonsRemaining; i++) {

							element = {}
							element.title="Desliza hacia derecha/izquierda para ver más opciones"
							let elementButtons = []
							
							for (var j = 0; j <= 2 && buttonsRemaining; j++) {
								

								if (buttonCount <= 29 && buttonCount <= buttons.length) {
									
									elementButtons.push(buttons[buttonCount])
									buttonCount++
								}

								if (buttonCount == buttons.length) {
										buttonsRemaining = false;
									}

		
							}

							element.buttons = elementButtons;
							elements.push(element)

							
						}
						
						messageData = {
							"attachment":{
								"type":"template",
								"payload":{
									"template_type":"generic",
									"elements":elements,
									
								}
							}
						}

						
						
						sendRequest(messageData,sender);


					}else{
						
						sendText("No tienes ninguna cámara registrada",sender);
						
					}

				}//else camera.find
				//console.log("respuesta else camera.find");
				//		console.log(respuesta);

			});//camera.find
			//console.log("respuesta camera.find");
			//			console.log(respuesta);

		};//else user.find
		//console.log("respuesta else user.find");
		//				console.log(respuesta);

	}); //user.find
	//console.log("se escribe esto primero ?");
	//return respuesta;
	

}




function sendText(message,sender){
	let messageData = {text:message};

	sendRequest(messageData,sender);
	
}

function sendImage(sender,url){
	let messageData = {
		"attachment":{
			"type":"image",
			"payload":{
				"url":url
			}
		}
	}

	sendRequest(messageData,sender);

}

function sendRequest(messageData,sender){
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