angular.module("app")

.controller("photoRecordController",function($scope,$http,$sessionStorage){
	$http.get("http://localhost:8080/api/photos/getPhotosByIdCamera/"+$sessionStorage.idCamera, {
                headers: {'x-access-token': $sessionStorage.token}
            }).then(function(response){
                $scope.cameraName = $sessionStorage.cameraName;
                $scope.photos = response.data;
                 

            });




$scope.formatDate = function(captured){
	var date = new Date(captured);
	return date+"";
}


})