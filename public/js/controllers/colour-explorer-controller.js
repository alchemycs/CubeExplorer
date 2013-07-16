/* jshint browser:true */
/* global define, Modernizr */

define(['vendor/angular'], function(angular) {
    'use strict';
    function attach(module) {
        module.controller('ColourExplorerController', ['$scope', function($scope) {
            $scope.cubeColour = '#002903';

            $scope.nativeColourPicker = Modernizr.inputtypes.color;

            $scope.$watch('cubeColour', function(newColour) {
                if (newColour) {
                    $scope.executeCubeCommand('all '+ newColour.substring(1) + ';');
                    $scope.$emit('command', 'all '+ newColour.substring(1) + ';');
                }
            });

            $scope.setCommand = function(event) {
                console.log(angular.element(event.target).text());
                $scope.cubeCommand = angular.element(event.target).text();
            };
        }]);
    }

    return {
        attach: attach
    };
});