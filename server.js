var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var jf = require('jsonfile');
var chokidar = require('chokidar');

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket) {
    var _nowPlayingFile = '\\\\13.1.1.81\\d$\\websites\\umbAFR\\nowPlaying.json';

    //initial notification
    sendNowPlayingToClient();

    //watch for file change
    var watcher = chokidar.watch(_nowPlayingFile, {});
    watcher.on('change', function(file) {
        //when file changes, send subsequent notifications
        sendNowPlayingToClient();
    });

    //function sends nowplaying notification data to client
    function sendNowPlayingToClient() {
        //read the file
        jf.readFile(_nowPlayingFile, function(err, data) {
            //emit the data to all clients when data is updated
            socket.emit('nowPlaying', data);
        });
    }
});

http.listen(3030, function() { //socket io listening on port 3030
    console.log('listening for socket connection(s) on *:3030');
});

var express = require('express'),
    check = express();
check.use('/', express.static(__dirname + '/'));
check.listen(8000, function() {
    console.log('webserver listening on *:8000');
});
