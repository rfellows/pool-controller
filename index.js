var serialport = require( "serialport" );
var SerialPort = serialport.SerialPort;

var PoolController = require( "./pool-controller.js" );

var COM = "/dev/ttyAMA0";

var serialPort = new SerialPort( COM,
  {
    baudrate: 9600,
    dataBits: 8
  }, false );


PoolController.on( "deviceOn", function deviceOn( device ) {
  console.log( device.name + " just turned on." );
} );
PoolController.on( "deviceOff", function deviceOn( device ) {
  console.log( device.name + " just turned off." );
} );

PoolController.on( "unknown message", function( data ) {
  console.log("~~~~~~~~Unknown~~~~~~~~~~");
  console.log( data.message );
  console.log( data.buffer );
  console.log("~~~~~~~~~~~~~~~~~~~~~~~~~");
} );

PoolController.on( "error", function( error ) {
  console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^");
  console.log("^^^^^^^^Error^^^^^^^^^^^^^");
  console.log( error.text );
  console.log( error.message );
  console.log( error.buffer );
  console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^");
  console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^");
} );

// setInterval( function() {
//   PoolController.getPoolStatus( function status( s ) {
//     console.log( s.toString() );
//   } );
// }, 10000 );

// PoolController.action.turnOnWaterfall();
// setTimeout( function() {
//   PoolController.action.turnOffWaterfall();
// }, 20000 );

serialPort.open( function( error ) {

  if( error ) {
    console.log( "Failed to open: " + error );
  } else {
    console.log( "Opened: " + COM );

    serialPort.on( "data", function( data ) {
      if( data.length > 1 ) {
        PoolController.read( data );
      }
    } );
  }
} );
