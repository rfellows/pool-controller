var serialport = require( "serialport" );
var SerialPort = serialport.SerialPort;

var PoolController = require( "./pool-controller.js" );
var PoolInfo = require( "./pool-info.js" );

var COM = "/dev/ttyAMA0";

var serialPort = new SerialPort( COM,
  {
    baudrate: 9600,
    dataBits: 8
  }, false );


// let me know when a device turns on/off
PoolController.on( "deviceOn", function deviceOn( device ) {
  console.log( device.name + " just turned on." );
} );
PoolController.on( "deviceOff", function deviceOn( device ) {
  console.log( device.name + " just turned off." );
} );

// let me know when i get a message that i don't recognize
PoolController.on( "unknown message", function( data ) {
  console.log("~~~~~~~~Unknown~~~~~~~~~~");
  console.log( data.message );
  console.log( data.buffer );
  console.log("~~~~~~~~~~~~~~~~~~~~~~~~~");
} );

// show me all errors
PoolController.on( "error", function( error ) {
  console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^");
  console.log("^^^^^^^^Error^^^^^^^^^^^^^");
  console.log( error.text );
  console.log( error.message );
  console.log( error.buffer );
  console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^");
  console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^");
} );

// let me know when the temperature setting has changed for the spa
PoolController.on( "temperatureSet", function( temp ) {
  console.log( "Set the spa heat to " + temp + " degrees" );
} );

// watch for status events
PoolController.on( "status", function( response ) {
  // console.log( response.toString() );
} );

PoolController.on( "heatSettings", function( response ) {
  console.log( response );
} );

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
// PoolController.action.setSpaTemperature( 100, function( status ) {
//   console.log(status);
// } );
setTimeout( function() {
  PoolController.getHeatStatus( function( heatSettings ) {
    console.log( heatSettings );
  } );
}, 5000 );
