'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('pooladmin', [
	'pool.globals',
	'ngRoute',
	'ngMaterial',
	'md.data.table',
	'ngStorage',
	'angularMoment',
	'utils.xhr',
	'utils.strings'	
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
    
app.run(['$rootScope', '$location', function($rootScope, $location){
    $rootScope.$on('$routeChangeStart', function(event){
        // call api behide firewall to test the authorization.
        dataService.getData("/admin/wallet", 
            function(data) {
            }, 
            function(err){
                if(err.status == 403){ 
                    event.preventDefault();               
                    // clear local storage and move to login.
                    dataService.logout();
                    $location.path('#login');               
            }
        });
    });
}]);

app.controller('AppCtrl', function($scope, $window, $route, $location, $interval, dataService, $localStorage, GLOBALS) {
    $scope.GLOBALS = GLOBALS;	        
    var forceSSL = function () {
        if ($location.protocol() !== 'https') {
            $window.location.href = $location.absUrl().replace('http', 'https');
        }
    };
    forceSSL();
	var loginCheck = function (){
		if(!dataService.isLoggedIn()){
			$location.path('#login');
		}
    }
    
	$scope.isLoggedIn = function () {
		return dataService.isLoggedIn();
	}

	$scope.logout = function () {
		dataService.logout();
		$location.path('#login');
    }
    
});