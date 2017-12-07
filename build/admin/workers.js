'use strict';

app.controller('AdminWorkersCtrl', function($scope, $location, $mdDialog, $route, $pageVisibility, $localStorage, dataService, timerService, addressService, minerService) {
    $scope.selected = [];    
    $scope.minerStats = {};    
    $scope.workersOrder = 'hashRate';
    $scope.workersOnline = "";
    $scope.options = {       
        limit: 30,
        page: 1
    };

    $scope.updateCharts = function (){        
		minerService.updateStats($scope.addrStats, function(minerStats){            
            $scope.minerStats = minerStats;            
		});
    }

    // Update miners everyime addrStats
	$scope.$parent.$watch('addrStats', function(newValue, oldValue) {
		$scope.updateCharts();
    });

	$scope.promise = dataService.getData("/admin/userList", function(data) {
        $scope.pool_workers = data;         
        var cnt = 0;
        _.each(data, function(addr, key) {
            if(addr.hashRate > 0){
                cnt = cnt + 1;
            }
        });
        $scope.workersOnline = cnt + " online";
    });

    $scope.loadWorkers = function(){
        dataService.getData("/admin/userList", function(data) {
            $scope.pool_workers = data;            
        });
    }

    $scope.selectWorker = function(item){                
        addressService.trackAddress(item.address);        
    }    

    $scope.greaterThan = function(prop, val){
        return function(item){
          return item[prop] > val;
        }
    }

    $scope.deselectWorker = function(item){
        addressService.deleteAddress(item.address);        
    }    

    $scope.deleteAddress = function (key, ev){
        addressService.deleteAddress(key);
        $scope.selected = [];
    }
    
    $scope.viewPayments = function(ev, miner, addr){
		$mdDialog.show({
			locals: {
				miner: miner,
				addr: addr
			},
			controller: "MinerPaymentsCtrl",
			templateUrl: 'user/dashboard/minerpayments.html',
			parent: angular.element(document.body),
			targetEvent: ev,
			clickOutsideToClose:true,
			fullscreen: !$scope.menuOpen
		})
		.then(function(answer) {
			$scope.status = 'You said the information was "' + answer + '".';
		}, function() {
			$scope.status = 'You cancelled the dialog.';
		});
	}

    // Recurring API calls and timer
	var loadData = function () {
        $scope.updateCharts();          
	};        
    
    // No spawn xhr reqs in bg
	$pageVisibility.$on('pageFocused', function(){
		minerService.runService(true);
	});

	$pageVisibility.$on('pageBlurred', function(){
		minerService.runService(false);
    });	
    
    // Register call with timer 
	timerService.register(loadData, $route.current.controller);
	loadData();
	
	$scope.$on("$routeChangeStart", function () {
		timerService.remove($route.current.controller);
	});
});