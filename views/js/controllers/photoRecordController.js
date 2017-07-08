angular.module("app")

.controller("photoRecordController",function($scope,$http,$sessionStorage,redirectFactory,$rootScope){

	if ($sessionStorage.token == undefined && $sessionStorage.idUser == undefined) {
        redirectFactory.login();
    }else{

	$http.get($rootScope.serverUrl+"/api/photos/getPhotosByIdCamera/"+$sessionStorage.idCamera, {
                headers: {'x-access-token': $sessionStorage.token}
            }).then(function(response){
                $scope.cameraName = $sessionStorage.cameraName;
                $scope.photos = response.data;
                 

            });




$scope.formatDate = function(captured){
	var date = new Date(captured);
	return date+"";
}

$scope.logout = function(){
        redirectFactory.logout(500);
    }



    }

})