/* jshint browser:true */
/* global define */

define([], function() {
    'use strict';
    var attach = function(module) {
        module.run(['$rootScope', function($rootScope) {

            $rootScope.$safeApply = function() {
                var $scope, fn, force = false;
                if(arguments.length === 1) {
                    var arg = arguments[0];
                    if(typeof arg === 'function') {
                        fn = arg;
                    }
                    else {
                        $scope = arg;
                    }
                }
                else {
                    $scope = arguments[0];
                    fn = arguments[1];
                    if(arguments.length === 3) {
                        force = !!arguments[2];
                    }
                }
                $scope = $scope || this;
                fn = fn || function() { };
                if(force || !$scope.$$phase) {
                    /* jshint -W030 */
                    $scope.$apply ? $scope.$apply(fn) : $scope.apply(fn);
                    /* jshint +W030 */
                }
                else {
                    fn();
                }
            };

        }]);
    };

    return {
        attach:attach
    };
});
