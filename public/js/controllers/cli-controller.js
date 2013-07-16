/* jshint browser:true */
/* global define */

define(['vendor/angular', 'directives/cube-directive'], function(angular, cubeDirective) {
    'use strict';
    function attach(module) {
        cubeDirective.attach(module);
        module.controller('CLIController', ['$scope', '$timeout', function($scope, $timeout) {
            $scope.cubeCommand = 'all black;';

            $scope.sendCubeCommand = function(command) {
                $scope.$emit('command', command);
                $scope.executeCubeCommand(command);
            };

            $scope.setCommand = function(event) {
                $scope.cubeCommand = angular.element(event.target).text();
            };

            $timeout(function() {
                $scope.sendCubeCommand($scope.cubeCommand);
            }, 0);


        }]);
    }

    return {
        attach: attach
    };
});