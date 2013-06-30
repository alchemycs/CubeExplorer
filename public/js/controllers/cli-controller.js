/* jshint browser:true */
/* global define */

define(['vendor/angular'], function(angular) {
    'use strict';
    function attach(module) {
        module.controller('CLIController', ['$scope', function($scope) {
            $scope.cubeCommand = 'all white;';

            $scope.setCommand = function(event) {
                $scope.cubeCommand = angular.element(event.target).text();
            };
        }]);
    }

    return {
        attach: attach
    };
});