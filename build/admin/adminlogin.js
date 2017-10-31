'use strict';

app.controller('AdminLoginCtrl', function($scope, $location, $route, $mdToast, dataService) {
	$scope.admin = {
		username:"",
		password:""
    }
    
	$scope.login = function () {
		dataService.postData("/authenticate", $scope.admin, function(data){	
			if (data.success){
				data.remember  = $scope.remember;
				dataService.setAuthToken(data);
				$location.path('#/dashboard');
			} else {
				// $mdDialog.hide(false);
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

	var isLoggedIn = function () {
		if(dataService.isLoggedIn == false) ;
	}

	if(dataService.isLoggedIn()) {
        // validity the admin token (allow access on admin)
        dataService.getData("/admin/wallet", 
            function(data) {
                $location.path('/dashboard');
            }, 
            function(err){
                if(err.status == 403){
                    $mdToast.show(
                        $mdToast.simple()
                          .textContent("You don't have permission to access this area!")
                          .position('top right')                       
                          .hideDelay(5000)
                    );
                    dataService.logout();                    
                }   
        });		
	};
});