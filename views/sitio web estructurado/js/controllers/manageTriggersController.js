angular.module("app")

.controller("manageTriggersController",function($http,$scope,notificationFactory,$sessionStorage){
	$scope.trigger = {}
	$http.get("http://secur-iot.herokuapp.com/api/cameras/"+$sessionStorage.idUser, {
                headers: {'x-access-token': $sessionStorage.token}
            }).then(function(response){
            	$scope.cameras = response.data;
                 

            })




 $scope.deleteTrigger = function(index){

 	$scope.selected.triggers.splice(index,1);
 	$scope.deleted = {}
 	$scope.deleted.index = index;

 	console.log($scope.selected);
 	$http.put("http://secur-iot.herokuapp.com/api/cameras/deleteTrigger/"+$scope.selected._id,$scope.deleted, {
                headers: {'x-access-token': $sessionStorage.token}
            }).then(function(response){
            	
				if (response.data.success==true) {
            		notificationFactory.success(response.data.message);

            		for (var i = 0; i < $scope.cameras.length; i++) {
            			if($scope.cameras[i]._id == $scope.selected._id){
            				$scope.cameras[i].triggers.splice(index,1);
            			}
            		}
            		

            	}else if(response.data.success == false){
            		notificationFactory.error(response.data.message);

            	}
                 

            })
            	

 	
 }

 $scope.checkInputs = function(){

 	if ($scope.trigger.name && $scope.trigger.description && $scope.trigger.type) {
 		return false;
 	}else{
 		return true;
 	}

 }

 $scope.addTrigger = function(){

 	$scope.camera = {};
 	$scope.camera.name = $scope.selected.name;
 	$scope.camera.triggers = [];
 	$scope.camera.triggers[0]= $scope.trigger;



 	$http.put("http://secur-iot.herokuapp.com/api/cameras/"+$scope.selected._id,$scope.camera, {
                headers: {'x-access-token': $sessionStorage.token}
            }).then(function(response){
            	
				if (response.data.success==true) {
					$scope.selected.triggers.push($scope.trigger);
            		notificationFactory.success(response.data.message);

            	}else if(response.data.success == false){
            		notificationFactory.error(response.data.message);

            	}
                 

            })



 }

})