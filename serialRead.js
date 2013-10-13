var sys = require('util');
var serialport = require("serialport");
var SerialPort = serialport.SerialPort; // localize object constructor

var sp = new SerialPort("/dev/cu.usbmodem1411", { 
  //parser: serialport.parsers.readline("\n")
});


sp.on("data", function (data) {
  //sys.puts("CATS: "+data);
});