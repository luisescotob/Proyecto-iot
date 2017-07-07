angular.module("app",["toastr","ngStorage"])

.factory('notificationFactory', function (toastr) {
    return {
        success: function (text) {
        	
        	toastr.success(text,"Success");
          	
        },
        error: function (text) {
            toastr.error(text, "Error");
        }
    };
})


.factory("redirectFactory",function($http,$window,$location,$rootScope){
    
    return{
        
        login: function(timeout){
            setTimeout(function() {$window.location.href ="login"}, timeout);
            
        },

        signup: function(timeout){
            setTimeout(function() {$window.location.href ="signup"}, timeout);

        },

        myCameras: function(timeout){
           
             setTimeout(function(){$window.location.href ="dashboard/myCameras"},timeout);
            //setTimeout(function() {$window.location.href ="dashboard/myCameras/?token="+$rootScope.token}, timeout);
            
            
            
            //$http.get("http://secur-iot.herokuapp.com/dashboard/myCameras", {
              //  headers: {'x-access-token': $rootScope.token}
            //}).then(function(response){
              //  console.log(response.data);
              //    if response es buena del token redirecciona else redreccopma desde el server

            //})
            
        },

        addCamera: function(timeout){
            setTimeout(function() {$window.location.href ="dashboard/addCamera"}, timeout);

        },

        photoRecord: function(timeout){
            setTimeout(function(){$window.location.href ="photoRecord"},timeout);

        },

        triggers: function(timeout){
            setTimeout(function() {$window.location.href ="dashboard/triggers"}, timeout);

        }
    }
})

