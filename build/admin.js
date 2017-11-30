'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('pooladmin', [
	'pool.globals',
	'ngRoute',
	'ngMaterial',
	'md.data.table',
    'ngStorage',
    'ngAudio',
    'angularMoment',
    'angular-page-visibility',
    'n3-line-chart',
	'utils.xhr',
    'utils.strings',
    'utils.services'
]).config(['$locationProvider', '$routeProvider', '$mdThemingProvider', function($locationProvider, $routeProvider, $mdThemingProvider, $mdIconProvider) {	
	$locationProvider.hashPrefix('');
	
	//$mdIconProvider.defaultIconSet("https://rawgit.com/angular/material-start/es5-tutorial/app/assets/svg/avatars.svg", 128)
	
	$mdThemingProvider
		.theme('default')
		.primaryPalette('indigo')
		.accentPalette('red');

	$routeProvider
		.when('/login', {
			templateUrl: 'admin/adminlogin.html',
			controller: 'AdminLoginCtrl',
			activetab: 'login'
		})
		.when('/dashboard', {
			templateUrl: 'admin/dashboard.html',
			controller: 'AdminDashCtrl',
			activetab: 'dashboard'
		})
		.when('/workers', {
			templateUrl: 'admin/workers.html',
			controller: 'AdminWorkersCtrl',
			activetab: 'workers'
		})
		.when('/ports', {
			templateUrl: 'admin/ports.html',
			controller: 'AdminPortsCtrl',
			activetab: 'ports'
		})
		.when('/config', {
			templateUrl: 'admin/config.html',
			controller: 'AdminConfigCtrl',
			activetab: 'config'
		})

		$routeProvider.otherwise({redirectTo: '/login'});

    }]);
    
app.run(['$rootScope', '$location', 'dataService', function($rootScope, $location, dataService, $localStorage, $sessionStorage){
    $rootScope.$on('$routeChangeStart', function(event){        
        dataService.getData("/admin/wallet", 
            function(data) { }, 
            function(err){
                if(err.status == 403) {                     
                    dataService.deleteStorage();                    
                    $location.path('/login').search({ permission: 'denied'});
                }
            }
        );
    });
}]);

app.controller('AppCtrl', function($scope, $window, $route, $location, $interval, dataService, timerService, addressService, $localStorage, GLOBALS) {
    $scope.GLOBALS = GLOBALS;	  
    $scope.addrStats = {}; // All tracked addresses      
    var forceSSL = function () {
        if ($location.protocol() !== 'https') {
            $window.location.href = $location.absUrl().replace('http', 'https');
        }
    };
    forceSSL();
	
	$scope.isLoggedIn = function () {
		return dataService.isLoggedIn();
	}

	$scope.logout = function () {
		dataService.logout();
		$location.path('#login');
    }
    
    var loadOnce = function () {
        dataService.getData("/config", function(data){
            $scope.config = data;
        });
    }

    loadOnce();

    timerService.startTimer(GLOBALS.api_refresh_interval);

    // Start address tracking servuce after starting timer, only one callback supported at a time
    addressService.start(function(addrStats) {
        $scope.addrStats = addrStats;        
    });
});