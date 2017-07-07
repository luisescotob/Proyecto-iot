angular.module("app")

.controller("accountSettingsController",function($scope,$http,notificationFactory,$sessionStorage,redirectFactory){

    var lastInfo = {}
    $scope.style = {}


    $http.get("http://localhost:8080/api/users/getUserById/"+$sessionStorage.idUser, {
                headers: {'x-access-token': $sessionStorage.token}
            }).then(function(response){
                

                $scope.user = response.data;

                lastInfo.name = response.data.name;
                lastInfo.lastName = response.data.lastName;
                lastInfo.email = response.data.email;
                lastInfo.fbId = response.data.fbId;
                lastInfo.username = response.data.username;
                lastInfo.password = response.data.password;


                if ($scope.user.systemStatus == "ON") {
                    $scope.style = {"color":"green"}

                }else if ($scope.user.systemStatus == "OFF"){
                    $scope.style = {"color":"red"}
                }


                 

            })


    $scope.checkInputs = function(){
     
        if ($scope.currentPassword && ($scope.user.name != lastInfo.name || $scope.user.lastName != lastInfo.lastName 
            ||$scope.user.email != lastInfo.email || $scope.user.username != lastInfo.username
            ||$scope.user.fbId != lastInfo.fbId || $scope.user.password != lastInfo.password)) {
            //enables the button when the values are all completed
            return false;
            

        }else{
            //disables the button when not all the values of the inputs are completed
           
            return true;
            
        }
    }


    $scope.saveChanges = function(){

        if ($scope.currentPassword == lastInfo.password) {

            $http.put("http://localhost:8080/api/users/updateUser/"+$sessionStorage.idUser,$scope.user, {
                headers: {'x-access-token': $sessionStorage.token}
            }).then(function(response){

                if (response.data.success == true) {
                    $scope.currentPassword = "";
                    notificationFactory.success(response.data.message);



                }else{
                    notificationFactory.error(response.data.message);
                }
                

            })

        }else{
            notificationFactory.error("Error, contraseña anterior no correcta");
        }


    }


    $scope.logout = function(){
        redirectFactory.logout(500);
    }






})
