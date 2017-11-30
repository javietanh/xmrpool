'use strict';

app.controller('AdminLoginCtrl', function($scope, $location, $route, $mdToast, dataService) {

    $scope.admin = {
		username:"",
		password:""
    }
    
	$scope.login = function () {
		dataService.postData("/authenticate", $scope.admin, function(data){	
			if (data.success){
				data.remember = $scope.remember;
				dataService.setAuthToken(data);
				$location.path('/dashboard').search({});
			} else {
				$mdToast.show(
                    $mdToast.simple()
                      .textContent("Please check your login details")
                      .position('top right')                       
                      .hideDelay(5000)
                );
			}
		}, function(error){            
            $mdToast.show(
                $mdToast.simple()
                  .textContent("Please check your login details")
                  .position('top right')                       
                  .hideDelay(5000)
            );
		});
    }
    
    // checking for permission denied.
    var urlParams = $location.search();
    if(urlParams.permission == "denied") {
        $mdToast.show(
            $mdToast.simple()
              .textContent("You don't have permission to access this area!")
              .position('top right')                       
              .hideDelay(5000)
        );
    }

    // if the user already login.
    if(dataService.isLoggedIn()) {
        $location.path('/dashboard').search({});
    }
});