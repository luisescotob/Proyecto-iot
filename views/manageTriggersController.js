angular.module("app")

.controller("manageTriggersController",function($http,$scope,notificationFactory,$sessionStorage){
    $scope.cameras;
	$http.get("http://localhost:8080/api/cameras/getCamerasByIdUser/"+$sessionStorage.idUser, {
                headers: {'x-access-token': $sessionStorage.token}
            }).then(function(response){
                
            	$scope.cameras = response.data;
                 

            })


    $http.get("http://localhost:8080/api/triggers/getTriggersByIdUser/"+$sessionStorage.idUser, {
                headers: {'x-access-token': $sessionStorage.token}
            }).then(function(response){
                
                $scope.triggers = response.data;
                 

            })


$scope.attachTrigger = function(){

    var selectedTrigger = $scope.selectedTrigger;


        $http.put("http://localhost:8080/api/cameras/attachTrigger/"+$scope.selectedCamera._id,selectedTrigger, {
                headers: {'x-access-token': $sessionStorage.token}
            }).then(function(response){
                


                if (response.data.success==true) {

                    for (var i = 0; i < $scope.cameras.length; i++) {

                        if ($scope.cameras[i]._id == $scope.selectedCamera._id) {
                            $scope.cameras[i].triggers.push(selectedTrigger);
                            $scope.selectedCamera.triggers.push(selectedTrigger);
                        }
                    
                    }

                    
                    notificationFactory.success(response.data.message);

                }else if(response.data.success == false){
                    notificationFactory.error(response.data.message);

                }
                 

            })



 }


$scope.unattachTrigger = function(index){
    
    var data = {}
    data.index = index;
    
    $http.put("http://localhost:8080/api/cameras/unattachTrigger/"+$scope.selectedCamera._id,data, {
                headers: {'x-access-token': $sessionStorage.token}
            }).then(function(response){
                

                if (response.data.success == true) {

                    for (var i = 0; i < $scope.cameras.length; i++) {

                        if ($scope.cameras[i]._id == $scope.selectedCamera._id) {
                            $scope.cameras[i].triggers.splice(index,1);
                            $scope.selectedCamera.triggers.splice(index,1);
                        }
                    
                    }

                    notificationFactory.success(response.data.message);
                }else if(response.data.success == false){
                    notificationFactory.error(response.data.message);
                }
                
                 

            })

}

$scope.checkInputs = function(){
    if ($scope.selectedCamera && $scope.selectedTrigger) {
        return false;
    }else{
        return true;
    }
}







})