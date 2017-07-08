angular.module("app")

.controller("myCamerasController",function($scope,$http,$sessionStorage,redirectFactory,notificationFactory){

    if ($sessionStorage.token == undefined && $sessionStorage.idUser == undefined) {
        redirectFactory.login();
    }else{

        
	$http.get("http://localhost:8080/api/cameras/getCamerasByIdUser/"+$sessionStorage.idUser, {
                headers: {'x-access-token': $sessionStorage.token}
            }).then(function(response){
            	console.log(response);
                console.log(response.data);
                $scope.cameras = response.data;
                 

            })



$scope.formatDate = function(captured){
    var date = new Date(captured);
    return date+"";
}



$scope.photoRecord = function(index){
	console.log($scope.cameras[index]);
	$sessionStorage.idCamera = $scope.cameras[index]._id;
	$sessionStorage.cameraName = $scope.cameras[index].name;
	redirectFactory.photoRecord(200);
	
}

$scope.activateCamera = function(index){

}

$scope.deleteCamera = function(index){
	$sessionStorage.idCamera = $scope.cameras[index]._id;
	console.log($sessionStorage.idCamera);
	$http.delete("http://localhost:8080/api/cameras/deleteCamera/"+$sessionStorage.idCamera, {
                headers: {'x-access-token': $sessionStorage.token}
            }).then(function(response){
            	console.log(response);
                console.log(response.data);
                $scope.cameras.splice(index,1);
                if (response.data.success == true) {
                	notificationFactory.success(response.data.message);
                }else if(response.data.success == false){
                	notificationFactory.error(response.data.message);
                }
                
                 

            })

}


    $scope.logout = function(){
        redirectFactory.logout(500);
    }



    }


})