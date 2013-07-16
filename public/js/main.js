/* jshint browser:true */
/* globals require */
/**
 * Simple require.js config and main to include jquery, bootstrap and angular
 *
 */

require.config({
    shim: {
        'socketio': {
            exports: 'io'
        },
        'vendor/jquery': {
            exports: '$' //So things like bootstrap and angular can access the global object
        },
        'vendor/bootstrap': [ 'vendor/jquery' ], //Requires jquery
        'vendor/angular': {
            deps: [ 'vendor/jquery' ], //Ok, angular doesn't require jquery, but you get more out of `angular.element` if you do!
            exports: 'angular'
        },
        'vendor/kinetic':{
            exports:'Kinetic'
        }
    },
    paths: {
        socketio:'../socket.io/socket.io'
    }
});

require(['socketio', 'vendor/jquery', 'vendor/angular', 'controllers/index', 'safeapply', 'vendor/bootstrap'], function (io, $, angular, controllers, safeApply) {
    'use strict';

    var cubeFunApp = angular.module('CubeExplorer', [])
        .config(['$routeProvider', function ($routeProvider) {
            $routeProvider
                .when('/', { templateUrl: '/partials/cli.html', controller: 'CLIController'})
                .when('/cli', { templateUrl: '/partials/cli.html', controller: 'CLIController'})
                .when('/colour-explorer', { templateUrl: '/partials/colour-explorer.html', controller: 'ColourExplorerController'})
                .when('/about', { templateUrl: '/partials/about.html', controller: 'NoopController'})
                .otherwise({ templateUrl: '/partials/404.html', controller: 'NoopController'})
            ;
        }])
        .controller('NoopController', [ '$scope' , function (/*$scope*/) {

        }])
        .run(['$rootScope', function($rootScope) {

            $rootScope.cubeAvailable = false;

            $rootScope.executeCubeCommand = function(command) {
                if (socket) {
                    console.log('Sending cube command: ', command);
                    socket.emit('send cube command', {
                        command:command
                    });
                }
            };

            // TODO : Refactor the socket communications to a service
            var socket = io.connect();
            socket.on('cube state', function(payload) {
                console.log('Cube State:', payload);
                $rootScope.$safeApply(function() {
                    $rootScope.cubeAvailable = payload.available;
                });
            });
            socket.on('receive cube data', function(payload) {
                console.log('Received Cube Data:');
                console.log(payload);
            });
        }]);

    controllers.attach(cubeFunApp);
    safeApply.attach(cubeFunApp);


    angular.bootstrap('html', ['CubeExplorer']);
});