angular.module("app")

.controller("registerTriggersController",function($scope,$http,notificationFactory,$sessionStorage){
    $scope.trigger = {}
    $scope.trigger.token = $sessionStorage.token;
    $scope.trigger.idUser = $sessionStorage.idUser;

    $http.get("http://localhost:8080/api/triggers/getTriggersByIdUser/"+$sessionStorage.idUser, {
                headers: {'x-access-token': $sessionStorage.token}
            }).then(function(response){
                $scope.triggers = response.data;


                 

            })

    $scope.addTrigger = function(){

        var trig = {}
        trig.name = $scope.trigger.name;
        trig.description = $scope.trigger.description;
        trig.type=$scope.trigger.type;
        trig.uuid=$scope.trigger.uuid;

        $http.post("http://localhost:8080/api/triggers/addTrigger", $scope.trigger)
            .then(function(response){
                if (response.data.success == true) {
                    console.log(response);
                    notificationFactory.success(response.data.message);
                    
                    trig._id=response.data.tid;

                    $scope.triggers.push(trig);

                    $scope.trigger.name="";
                    $scope.trigger.description="";
                    $scope.trigger.type="";
                    $scope.trigger.uuid="";
                    
                    
                    
                }else{
                    console.log(response);
                    notificationFactory.error(response.data.message);

                }
                
                
                
            }
        );
    }

    $scope.checkInputs = function(){
        if ($scope.trigger.name && $scope.trigger.description && $scope.trigger.type && $scope.trigger.uuid) {
            //enables the button when the values are all completed
            return false;
        }else{
            //disables the button when not all the values of the inputs are completed
            return true;
        }
    }


$scope.deleteTrigger = function(index){
    var idTrigger = $scope.triggers[index]._id;
    console.log(idTrigger);

    $http.delete("http://localhost:8080/api/triggers/deleteTrigger/"+idTrigger, {
                headers: {'x-access-token': $sessionStorage.token}
            }).then(function(response){
                console.log(response);
                console.log(response.data);
                $scope.triggers.splice(index,1);
                if (response.data.success == true) {
                    notificationFactory.success(response.data.message);
                }else if(response.data.success == false){
                    notificationFactory.error(response.data.message);
                }
                
                 

            })

}




})
