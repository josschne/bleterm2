#!/usr/bin/env node
var noble = require('noble-mac');

var argv = require('minimist')(process.argv.slice(2));

//Must provide the target device name as an argument
if (argv._.length != 1) {
  printHelp();
  process.exit(0);
}

var deviceName = argv._[0].toLowerCase();

//Optionally provide the service UUID with -serviceUUID "xxxx...xxxx"
var serviceUUID = (argv.serviceUUID && argv.serviceUUID.split(',')) || ["6e400001b5a3f393e0a9e50e24dcca9e"];

//Optionally provide the rx/tx UUIDs with comma-separated -characteristicUUID "xxxx...xxxx","xxxx...xxxx"
var characteristicUUIDs = (argv.charUUIDs && argv.charUUIDs.split(',')) || [];

noble.on('stateChange', function(state) {
  if (state === 'poweredOn') {
    console.log(`Scanning for ${deviceName}... (Ctrl-D to stop)`);
    noble.startScanning();
  } else {
    console.log('Scanning stopped - is Bluetooth adapter connected / turned on?');
    noble.stopScanning();
  }
});

noble.on('discover', function(peripheral) {
  var advertisement = peripheral.advertisement;
  var localName = advertisement.localName;

  if (localName && localName.toLowerCase() == deviceName) {
    noble.stopScanning();

    console.log(`Connected to ${deviceName}!`);
    console.log(`(Ctrl-D to disconnect)`);
    console.log();

    connectToUart(peripheral);
  }
});

var uartReadChar = null;
var uartWriteChar = null;

function connectToUart(peripheral) {
  peripheral.once('disconnect', function() {
    console.log();
    console.log(`Disconnected. Scanning for ${deviceName}...`);

    uartReadChar = null;
    uartWriteChar = null;
    noble.startScanning();
  });

  peripheral.connect(function(err) {
      peripheral.discoverSomeServicesAndCharacteristics(
        serviceUUID,
        characteristicUUIDs, 
        function(err, services, characteristics) {
          for(i=0; i<characteristics.length; i++) {
            var char = characteristics[i];
            if (char.properties.includes('notify')) {
              uartReadChar = char;
              uartReadChar.subscribe(function(err) {
                if (err) {
                  console.error(`Failed to subscribe to read characteristic: ${err}`);
                }
              });
              uartReadChar.on('data', function(data) {
                process.stdout.write(data);
              });
            } else if (char.properties.includes('write')) {
              uartWriteChar = char;
            }
          }
        }
      );
  });
}

if (process.stdin.isTTY && process.stdout.isTTY) {
  process.stdin.setRawMode(true);

  process.stdin.on('data', function(data) {
    if (data) {
      if ((data.length === 1) && (data[0] === 0x04)) {  //Ctrl-D
        process.exit(0);
      }
      if (uartWriteChar) {
        uartWriteChar.write(data, false, function(err) {
          if (err) {
            console.error(`Failed to write data to write characteristic: ${err}`);
          }
        });
      }
    }
  });
}

function printHelp() {
  console.log('Usage: bleterm2 [-serviceUUID "xxxx..."] [-charUUIDs "xxxx..","xxxx.."] <device name>');
}