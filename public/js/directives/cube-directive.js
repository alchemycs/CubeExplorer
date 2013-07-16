/* jshint browser:true */
/* global define */

define(['vendor/Kinetic'], function(Kinetic) {
    'use strict';
    function attach(module) {
        module.directive('cube', [function() {
            return {
                restrict:'EA',
                link:function($scope, $element, $attributes) {

                    var eventPrefix = '';
                    if ($attributes.eventPrefix) {
                        console.log('Event prefix', $attributes.eventPrefix);
                        eventPrefix = $attributes.eventPrefix;
                    }

                    // TODO : Use smallestSide to do scale the cube model in the viewport
//                    var smallestSide = Math.min($attributes.width, $attributes.height);

                    var lightDimension = 4; // 4x4x4 cube
                    var lightRadius = 30;
                    var lightPadding = 0.4;

                    //Angles for projecting for pseudo-3D
                    //(I don't know WebGL, so fake it until you make it!)
                    function deg2rad(deg) {
                        return deg/180*Math.PI;
                    }
                    function project(x,y,z) {
                        //Can you believe I memorized this formulae from BYTE magazine way back in the C=64 days? sheesh
                        var x1 = x*Math.cos(xAng)+y*Math.cos(yAng)+z*Math.cos(zAng);
                        var y1 = x*Math.sin(xAng)+y*Math.sin(yAng)+z*Math.sin(zAng);
                        return { x:Math.round(x1), y:Math.round(y1) };
                    }
                    var xAng = deg2rad(5),
                        yAng = deg2rad(-30),
                        zAng = deg2rad(-90);

                    //Points are stored in an array and ordered in the array from the back so a simple index iteration can draw from back to front
                    function pointToIndex(x,y,z) {
                        var index = x + (3-y)*lightDimension*lightDimension + z*lightDimension;
                        return index;
                    }

                    var stage = new Kinetic.Stage({
                        container:$element[0],
                        width:$attributes.width,
                        height:$attributes.height
                    });

                    var backgroundLayer = new Kinetic.Layer({
                        x:0,
                        y:0
                    });

                    backgroundLayer.add(new Kinetic.Rect({
                        x:0,
                        y:0,
                        width:$attributes.width,
                        height:$attributes.height,
                        fill:'black'
                    }));

                    var layer = new Kinetic.Layer({
                        x:$attributes.width/4,
                        y:$attributes.height/4*3
                    });


                    var zProjection = project(0,0,200);
                    var lineZ = new Kinetic.Line({
                        points:[0,0, zProjection.x, zProjection.y],
                        stroke:'white'
                    });
                    var yProjection = project(0,200,0);
                    var lineY = new Kinetic.Line({
                        points:[0,0, yProjection.x, yProjection.y],
                        stroke:'white'
                    });
                    var xProjection = project(200,0,0);
                    var lineX = new Kinetic.Line({
                        points:[0,0, xProjection.x, xProjection.y],
                        stroke:'white'
                    });

                    layer.add(lineZ);
                    layer.add(lineY);
                    layer.add(lineX);

                    var lightMouseOver = function(event) {
                        var light = event.targetNode;
                        light.setStroke('white');
                        layer.draw();
                        $scope.$emit(eventPrefix+'cubemouseover', light);
                    };
                    var lightMouseOut = function(event) {
                        var light = event.targetNode;
                        light.setStroke('grey');
                        layer.draw();
                        $scope.$emit(eventPrefix+'cubemouseout', light);
                    };
                    var lightClick = function(event) {
                        var light = event.targetNode;
//                                        light.setFill('white');
//                                        layer.draw();
                        $scope.$emit(eventPrefix+'cubeclick', light);
                    };
                    var cubeMatrix = [];
                    //Initialize the cube matrix. Stored as an index to iterate from the back to the front when drawing
                    (function() {
                        for (var y=lightDimension-1; y >=0; y--) {
                            for (var z=0; z < lightDimension; z++) {
                                for (var x=0; x < lightDimension; x++) {
                                    var cubeLocation = {
                                        x:x*lightRadius*2,
                                        y:y*lightRadius*2,
                                        z:z*lightRadius*2
                                    };
                                    var projection = project(cubeLocation.x, cubeLocation.y, cubeLocation.z);
                                    var light = new Kinetic.Circle({
                                        x:projection.x,
                                        y:projection.y,
                                        radius:Math.round(lightRadius*(1-lightPadding)),
                                        stroke:'grey',
                                        strokeWidth:1,
                                        fill:'black'
                                    });
                                    light.cubeLocation = cubeLocation;
                                    layer.add(light);
                                    cubeMatrix[cubeMatrix.length] = light;
                                    light.on('mouseover', lightMouseOver);
                                    light.on('mouseout', lightMouseOut);
                                    light.on('click', lightClick);
                                }
                            }
                        }
                    })();

                    stage.add(backgroundLayer);
                    stage.add(layer);



                    //TODO : The instructions should be an easy to extend object
                    var instructions = {
                        'all':(function() {
                            var expression = /^\s*all\s+(black|white|red|green|blue|[0-9a-fA-F]{6})\s*$/;
                            var execute = function(command) {
                                console.log('command (all): ', expression.exec(command));
                                for (var index=0; index < cubeMatrix.length; index++) {
                                    cubeMatrix[index].setFill(expression.exec(command)[1]);
                                }
//                                console.log(expression.test(command));
                            };
                            return {
                                expression:expression,
                                execute:execute
                            };
                        })(),
                        'set':(function() {
                            var expression = /^\s*set\s+((?:[0-3]\s*){3})\s+(black|white|red|green|blue|[0-9a-fA-F]{6})\s*$/;
                            var execute = function(command) {
                                console.log('command (set): ', expression.exec(command));
                                var colour = expression.exec(command)[2];
                                var point = expression.exec(command)[1].split('');
                                console.log('Colour: '+ colour);
                                console.log('Point: ', point);
                                var index = pointToIndex(parseInt(point[0],10), parseInt(point[1],10), parseInt(point[2],10));
                                console.log('Index: '+index);
                                cubeMatrix[index].setFill(colour);
                            };
                            return {
                                expression:expression,
                                execute:execute
                            };
                        })()
                        // TODO : Need to add in the rest of the commands
                    };
                    function parseCommand(commands) {
                        var commandList = commands.split(';');
                        var command, key;
                        while(commandList.length) {
                            command = commandList.pop(commandList);
                            for (key in instructions) {
                                if (instructions.hasOwnProperty(key)) {
                                    console.log(instructions[key].expression);
                                    if (instructions[key].expression.test(command)) {
                                        instructions[key].execute(command);
                                    }
                                }
                            }
                        }
                        layer.draw();
                    }

                    $scope.$on(eventPrefix+'command', function(event, payload) {
                        parseCommand(payload);
                    });

                }
            };
        }]);
    }

    return {
        attach:attach
    };

});