angular.module("app")

.controller("loginController",function($scope,$http,notificationFactory,redirectFactory,$sessionStorage){
	$scope.user = {}
	$scope.login = function(){

		$http.post("http://localhost:8080/login", $scope.user)
   			.then(function(response){
       		 	console.log(response);
       		 	if (response.data.success == true) {
       		 		notificationFactory.success(response.data.message);
	              $sessionStorage.token = response.data.token;
	              
	              $sessionStorage.idUser = response.data.idUser;
	              console.log($sessionStorage.token);
	              redirectFactory.myCameras(500);
              

       		 	}else if (response.data.success == false) {
       		 		notificationFactory.error(response.data.message);
       		 	}

       		 	
       		  });


	}






	$scope.checkInputs = function(){
		if ($scope.user.username && $scope.user.password) {
			return false;
		}else{
			return true;
		}
	}



})

	