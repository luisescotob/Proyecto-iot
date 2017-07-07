angular.module("app")

.controller("photoRecordController",function($scope,$http,$sessionStorage){
	$http.get("http://secur-iot.herokuapp.com/api/photos/"+$sessionStorage.idCamera, {
                headers: {'x-access-token': $sessionStorage.token}
            }).then(function(response){
                $scope.cameraName = $sessionStorage.cameraName;
                $scope.photos = response.data;
                 

            });


})