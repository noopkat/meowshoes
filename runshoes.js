// set up the essentials

var Hapi = require('hapi'),
    server = new Hapi.Server('localhost', 3000),
    io = require('socket.io').listen(server),
    five = require('johnny-five'),
    board = new five.Board();

  var leftStand  = true,
      rightStand = true;

  var tapTimeoutThresh = 30;

io.sockets.on('connection', function(socket) {

  board.on('ready', function() {

    var shoes = {
      left: {
        toe: { val: 0, timeout: 0 },
        heel: { val: 0, timeout: 0 }
      },
      right: {
        toe: { val: 0, timeout: 0 },
        heel: { val: 0, timeout: 0 }
      }
    };

    var leftToe = new five.Sensor({
      pin: 'A0',
      freq: 25
    }).on('data', function() {
      shoes.left.toe.val = this.value;
    });

    var leftHeel = new five.Sensor({
      pin: 'A1',
      freq: 25
    }).on('data', function() {
      shoes.left.heel.val = this.value;
    });

    var rightToe = new five.Sensor({
      pin: 'A2',
      freq: 25
    }).on('data', function() {
      shoes.right.toe.val = this.value;
    });

    var rightHeel = new five.Sensor({
      pin: 'A3',
      freq: 25
    }),.on('data', function() {
      shoes.right.heel.val = this.value;
    });

    // main loop to calc foot tap logic
    this.loop(10, function() {

      // if left foot tap is already pending, and the tap lasted for at least 300 milliseconds
      // if (pendingTapLeft) {

      //   if (tapTimeoutLeftToe > tapTimeoutThresh)) {
      //     // send tap
      //     socket.emit('tap', 'left toe');
      //     pendingTapLeft = false;
      //     tapTimeoutLeftToe = 0;
      //   } 
      //   if (tapTimeoutLeftHeel > tapTimeoutThresh)) {
      //     // send tap
      //     socket.emit('tap', 'left heel');
      //     pendingTapLeft = false;
      //     tapTimeoutLeftHeel = 0;
      //   } 

      // }

      // if right foot tap is already pending, and the tap lasted for at least 300 milliseconds
      // if (pendingTapRight) {

      //   if (tapTimeoutRightToe > tapTimeoutThresh)) {
      //     // send tap
      //     socket.emit('tap', 'right toe');
      //     pendingTapRight = false;
      //     tapTimeoutRightToe = 0;
      //   } 
      //   if (tapTimeoutRightHeel > tapTimeoutThresh)) {
      //     // send tap
      //     socket.emit('tap', 'right heel');
      //     pendingTapRight = false;
      //     tapTimeoutRightHeel = 0;
      //   } 

      // }

      // check for each sensor being pressed, set pending tap and increment time tapped for
      // make sure to check both sensors in a foot are down, otherwise the user is standing/pausing

      // // left toe
      // if (isPressed(shoes.left.toe.val) && !isPressed(shoes.left.heel.val)) {
      //   shoes.left.toe.timeout += 1;
      //   if (shoes.left.toe.timeout > tapTimeoutThresh) {
      //     // emit tap
      //     socket.emit('tap', 'left toe');
      //     shoes.left.toe.timeout = 0;
      //   }  
      // } else { 
      //   // tap not completed 
      //   shoes.left.toe.timeout = 0; 
      // }

      // // left heel
      // if (isPressed(shoes.left.heel.val) && !isPressed(shoes.left.toe.val)) {
      //   shoes.left.heel.timeout += 1;
      //   if (shoes.left.heel.timeout > tapTimeoutThresh) {
      //     // emit tap
      //     socket.emit('tap', 'left heel');
      //     shoes.left.heel.timeout = 0;
      //   }  
      // } else { 
      //   // tap not completed 
      //   shoes.left.heel.timeout = 0; 
      // }

      // // right toe
      // if (isPressed(shoes.right.toe.val) && !isPressed(shoes.right.heel.val)) {
      //   shoes.right.toe.timeout += 1;
      //   if (shoes.right.toe.timeout > tapTimeoutThresh) {
      //     // emit tap
      //     socket.emit('tap', 'right toe');
      //     shoes.right.toe.timeout = 0;
      //   }  
      // } else { 
      //   // tap not completed 
      //   shoes.right.toe.timeout = 0; 
      // }

      // // right heel
      // if (isPressed(shoes.right.heel.val) && !isPressed(shoes.left.toe.val)) {
      //   shoes.right.heel.timeout += 1;
      //   if (shoes.right.heel.timeout > tapTimeoutThresh) {
      //     // emit tap
      //     socket.emit('tap', 'right heel');
      //     shoes.right.heel.timeout = 0;
      //   }  
      // } else { 
      //   // tap not completed 
      //   shoes.right.heel.timeout = 0; 
      // }

      // loop through left and right shoes
      for (var foot in shoes) {
        if (!shoes.hasOwnProperty(foot)) continue;

        // if user is not standing (both sensors down in a foot)
        if (!isStanding(foot)) {
          // loop through heel and toe
          for (var sensor in foot) {
            if (!foot.hasOwnProperty(sensor)) continue;
            var footSensor = shoes[foot][sensor];
            var timeout = footSensor.timeout;

            if (isPressed(footSensor.val)) {
              timeout += 1;
              // if sensor pressed for long enough, it'll become an official tap
              // currently 300m
              if (timeout > tapTimeoutThresh) {
                socket.emit('tap', footsensor);
                timeout = 0;
              }

            } else {
              timeout = 0;
            }
          }
        // if standing, reset feet sensor timeouts
        } else {
          shoes[foot].toe.timeout = 0;
          shoes[foot].heel.timeout = 0;
        }

      } // end loop  

    }); // end j5 main loop

  }); //end board
}); // end io

function isPressed(val) {
  if (val < 30) {
    return true;
  } else {
    return false;
  } 
}

function isStanding(foot) {
  if (isPressed(shoes[foot].toe.val) && isPressed(shoes[foot].heel.val)) {
    return true;
  } else {
    return false;
  } 
}
  
// set up a new serial port, locate the Arduino plugged in via USB
// for multiple tinyduinos, just create a new serial port, but emit the data the same way
// var sp = new SerialPort("/dev/cu.usbmodem1411", { 
//   parser: serialport.parsers.readline("\n")
// });

// for the javascript, css and images, lazy lazy.
//app.use(express.static(__dirname));

// start in the root, and find the html file we're using
// app.get('/', function (req, res) {
//   res.sendfile(__dirname + '/index.html');
// });


server.route({
    method: 'GET',
    path: '/',
    handler: {
      directory: {
        path: __dirname,
        listing: false
      }
    }
});

server.start();
// use port 3000
//server.listen(3000);