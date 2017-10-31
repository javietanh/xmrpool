'use strict';

app.controller('AdminWorkersCtrl', function($scope, $location, $route, dataService) {
    $scope.selected = [];
    $scope.options = {
        limit: 10,
        page: 1
    };

	$scope.promise = dataService.getData("/admin/userList", function(data) {
		$scope.pool_workers = data;
    }, function(err){
        if(err.status == 403){
            $location.path('#login');
        }        
    });

    $scope.loadWorkers = function(){
        dataService.getData("/admin/userList", function(data) {
            $scope.pool_workers = data;
        });
    }
});