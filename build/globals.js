'use strict';

angular.module('pool.globals', [])

.factory('GLOBALS', function() {
	return {
		pool_name: "xmrpools.asia",
		api_url : 'https://api.xmrpools.asia',
		api_refresh_interval: 30000,
		app_update_interval: 10*60000
	};
});
