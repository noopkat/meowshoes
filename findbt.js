var noble = require('noble');

// this is a rudimentary test of noble and finding my meow shoes
// YO DAWG, I HEARD YOU LIKE CALLBACKS
noble.startScanning(['195ae58a437a489bb0cdb7c9c394bae4'], false);
noble.on('discover', function(peripheral){
  peripheral.connect();
  //noble.stopScanning();
  peripheral.on('connect', function() {
    console.log('connected!');
    console.log(peripheral);
    peripheral.discoverServices();
    peripheral.on('servicesDiscover', function (services) {
      console.log('deviceInfoService: ' + services[1]);
      services[1].discoverCharacteristics();
      services[1].on('characteristicsDiscover', function (characteristics) {
        console.log('characteristicInfo: ' + characteristics);
        characteristics[1].read();
        characteristics[1].on('read', function (data, isNotification) {
          console.log('characteristicData: ' + data.toString(), 'isNotification: ' + isNotification);
        });
      });
    });
  });
});

// ok so the tinyduino's serviceUuids is 195ae58a437a489bb0cdb7c9c394bae4
// maybe it's 46e296ca3d1548958bdf50a83b78dc64
// characteristic is 46e296ca3d1548958bdf50a83b78dc64
// battery life hex = 0x2A19
// device name hex = 0x2A00
// var serviceUUIDs = ['195ae58a437a489bb0cdb7c9c394bae4'];
// var characteristicUUIDs = ['46e296ca3d1548958bdf50a83b78dc64'];

// SOFTWARE MODEL

// All Bluetooth Low Energy devices use the Generic Attribute Profile (GATT). The application programming interface offered by a Bluetooth LE-aware operating system will typically be based around GATT concepts.[59] GATT has the following terminology:

// Client
// A device that initiates GATT commands and requests, and accepts responses, for example a computer or smartphone.

// Server
// A device that receives GATT commands and requests, and returns responses, for example a temperature sensor.

// Characteristic
// A data value transferred between client and server, for example the current battery voltage.

// Service
// A collection of related characteristics, which operate together to perform a particular function. For instance, the Health Thermometer service includes characteristics for a temperature measurement value, and a time interval between measurements.

// Descriptor
// A descriptor provides additional information about a characteristic. For instance, a temperature value characteristic may have an indication of its units (e.g. Celsius), and the maximum and minimum values which the sensor can measure. Descriptors are optional - each characteristic can have any number of descriptors.

// Some service and characteristic values are used for administrative purposes - for instance, the model name and serial number can be read as standard characteristics within the Generic Access service. Services may also include other services as sub-functions; the main functions of the device are so-called primary services, and the auxiliary functions they refer to are secondary services.