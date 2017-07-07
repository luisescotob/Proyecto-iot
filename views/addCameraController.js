angular.module("app")

.controller("addCameraController",function($scope,$http,notificationFactory,$sessionStorage){
	$scope.camera = {}
	$scope.camera.token = $sessionStorage.token;
	$scope.camera.idUser = $sessionStorage.idUser;

	$scope.addCamera = function(){

		$http.post("http://secur-iot.herokuapp.com/api/cameras", $scope.camera)
   			.then(function(response){
       		 	if (response.data.success == true) {
       		 		console.log(response);
       		 		notificationFactory.success(response.data.message);
       		 	}else{
       		 		console.log(response);
					notificationFactory.error(response.data.message);       		 		
       		 	}
       		 	
       		 	
       		 	
       		}
    	);
	}

$scope.checkInputs = function(){
		if ($scope.camera.name) {
			//enables the button when the values are all completed
			return false;
		}else{
			//disables the button when not all the values of the inputs are completed
			return true;
		}
	}


})



