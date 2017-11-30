'use strict';

app.controller('AdminDashCtrl', function($scope, $location, $route, dataService) {
    $scope.selected = [];    
    $scope.options = {
        limit: 10,
        page: 1
    };

    dataService.getData("/admin/stats", function(data) {
        $scope.pool_stats = data;
        console.log($scope.pool_stats)
	}, function(err){
        
    });

	dataService.getData("/admin/wallet", function(data) {
		$scope.pool_wallet = data;
	}, function(err){
        
    });

	$scope.promise = dataService.getData("/admin/wallet/history", function(data) {
		$scope.pool_wallet_history = data;
	}, function(err){
        
    });

    $scope.loadHistory = function(){
        dataService.getData("/admin/wallet/history", function(data) {
            $scope.pool_wallet_history = data;
        });
    }
});