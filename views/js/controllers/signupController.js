angular.module("app")

  .controller("registroController",function($scope,$http,notificationFactory,redirectFactory,$sessionStorage,$rootScope){

  	
	$scope.user = {}
	$scope.registerUser = function(){
		
		$http.post($rootScope.serverUrl+"/signup", $scope.user)
   			.then(function(response){
       		 	console.log(response);
       		 	notificationFactory.success(response.data.message);
       		 	redirectFactory.login(1300);
       		
       		 
       		 	
       		 	
       		}, 
       		function(response){
        	 notificationFactory.error(response.data.message);
       }
    );

	}

	$scope.checkInputs = function(){
		if ($scope.user.name && $scope.user.lastName && $scope.user.username && $scope.user.email && $scope.user.password) {
			//enables the button when the values are all completed
			return false;
		}else{
			//disables the button when not all the values of the inputs are completed
			return true;
		}
	}
	

    
	
})



  
