var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var jf = require('jsonfile'); 
var fs = require('fs');
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});
io.sockets.on('connection', function(socket) {
    fs.watch("data.json", function(event, fileName) { //watching data.json file for any changes
        jf.readFile('data.json', function(err, data) { //if change detected read the data.json file
            var data = data; //store data.json data in a var
            console.log(data);
            console.log('updated JSON data') //just for debugging if there's a problem
            socket.volatile.emit('notification', data); //emit the data to all clients when data is updated
        });
    });
});
http.listen(3030, function() { //socket io listening on port 3030
    console.log('listening on *:3030');
});
//
var express = require('express'),
check = express(); 
check.use('/', express.static(__dirname + '/'));
check.listen(8000, function() { //socket io listening on port 3030
    console.log('webserver listening on *:8000');
});
