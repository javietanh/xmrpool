'use strict';

app.controller('AdminDashCtrl', function($scope, $location, $route, dataService) {
    $scope.selected = [];    
    $scope.options = {
        limit: 10,
        page: 1
    };

    dataService.getData("/admin/stats", function(data) {
		$scope.pool_stats = data;
	}, function(err){
        if(err.status == 403){
            $location.path('#login');
        }        
    });

	dataService.getData("/admin/wallet", function(data) {
		$scope.pool_wallet = data;
	}, function(err){
        if(err.status == 403){
            $location.path('#login');
        }        
    });

	$scope.promise = dataService.getData("/admin/wallet/history", function(data) {
		$scope.pool_wallet_history = data;
	}, function(err){
        if(err.status == 403){
            $location.path('#login');
        }        
    });

    $scope.loadHistory = function(){
        dataService.getData("/admin/wallet/history", function(data) {
            $scope.pool_wallet_history = data;
        });
    }
});