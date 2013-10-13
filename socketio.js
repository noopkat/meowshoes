// set up the essentials

var sys = require('util'),
    express = require('express'),
    app = express(),
    http = require('http'),
    server = http.createServer(app),
    io = require('socket.io').listen(server),
    serialport = require("serialport"),
    SerialPort = serialport.SerialPort;
    

  
// set up a new serial port, locate the Arduino plugged in via USB
// for multiple tinyduinos, just create a new serial port, but emit the data the same way
var sp = new SerialPort("/dev/cu.usbmodem1411", { 
  parser: serialport.parsers.readline("\n")
});

// for the javascript, css and images, lazy lazy.
app.use(express.static(__dirname));

// start in the root, and find the html file we're using
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

// emit the analogue data value each time it receives
io.sockets.on('connection', function (socket) {
  // put another emit here for something like sp2 (rename sp and sp2 to perhaps left foot and right foot?)
  sp.on("data", function (data) {
    // console.log(data);
    socket.emit('sp', data);
  });
});

// use port 3000
server.listen(3000);