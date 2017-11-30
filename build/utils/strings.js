'use strict';

angular.module('utils.strings', [])

.filter('toXMR', function() {
  return function(amount) {
    return amount / 1000000000000;
  };
})

.filter('toHashRate', function() {
  return function(hashes) {
    if (hashes > 1000000) {
      return parseFloat((hashes / 1000000).toFixed(2)) + " MH/s"
    }
    if (hashes > 1000) {
      return parseFloat((hashes / 1000).toFixed(2)) + " KH/s"
    }
    return ( hashes || 0 ) + " H/s"
  };
})

.filter('hashToLink', function($sce) {
  return function(hash, type) {
    var str = (hash == undefined) ? 'none' : "<a class=\"md-body-2\" target=\"_new\" href=\"https://xmrchain.net/"+type+"/" + hash + "\">" + hash + "</a>";
    return $sce.trustAsHtml(str); 
  };
})

.filter('difficultyToHashRate', function() {
  return function(hashrate) {
    return Math.floor(hashrate / 120)
  };
})

.filter('cut', function () {
    return function (value, wordwise, max, tail) {
        if (!value) return '';

        max = parseInt(max, 10);
        if (!max) return value;
        if (value.length <= max) return value;

        value = value.substr(0, max);
        if (wordwise) {
            var lastspace = value.lastIndexOf(' ');
            if (lastspace !== -1) {
              //Also remove . and , so its gives a cleaner result.
              if (value.charAt(lastspace-1) === '.' || value.charAt(lastspace-1) === ',') {
                lastspace = lastspace - 1;
              }
              value = value.substr(0, lastspace);
            }
        }

        return value + (tail || ' …');
    };
});

