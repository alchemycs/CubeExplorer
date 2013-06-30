/* jshint node:true */
/**
 * Module dependencies.
 */
'use strict';
var express = require('express'),
    http = require('http'),
    app = express(),
    Socket = require('socket.io');
var serialPort = require('serialport');
var cubePortReady = false;

var SERIAL_PORT = '/dev/cu.usbmodemfa131';
var SERIAL_BAUDRATE = 115200;

require('./config/environment')(app, express);
require('./config/routes')(app);

var server = http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});

// TODO : Need to clean up all the serial and socket stuff

var io = Socket.listen(server);

io.sockets.on('connection', function(socket) {
    socket.emit('cube state', {
        available: cubePortReady
    });
    socket.on('query cube state', function() {
        socket.emit('cube state', {
            available:cubePortReady
        });
    });
    socket.on('send cube command', function(payload) {
        if (cubePortReady) {
            console.log('Sending cube command:', payload);
            cubePort.write(payload.command + '\n');
        }
    });
});

var cubePort = new serialPort.SerialPort(SERIAL_PORT, {
    baudrate:SERIAL_BAUDRATE,
    parser:serialPort.parsers.readline('\n')
});

cubePort.on('open', function() {
    cubePortReady = true;
    console.log('Cube Port Is Ready');
    cubePort.write('help;\n');
    io.sockets.emit('cube state', {
        available:true
    });
});
cubePort.on('data', function(data) {
    console.log('Cube Sent: '+data);
    io.sockets.emit('receive cube data', {
        data:data
    });
});
cubePort.on('close', function() {
    cubePortReady = false;
    io.sockets.emit('cube state', {
        available:false
    });
    console.log('closed');
});