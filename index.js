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


PoolController.on( "deviceOn", function deviceOn( device ) {
  console.log( device.name + " just turned on." );
} );
PoolController.on( "deviceOff", function deviceOn( device ) {
  console.log( device.name + " just turned off." );
} );

// PoolController.on( "start message", function( data ) {
//   console.log("<message type='" + data.name + "'>");
// } );
//
// PoolController.on( "end message", function( data ) {
//   console.log("</message type='" + data.name + "'>");
// } );

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

PoolController.on( "temperatureSet", function( temp ) {
  console.log( "Set the spa heat to " + temp + " degrees" );
} );

PoolController.on( "heater", function( result, messageBuffer ) {
  console.log( "HEATER - " + result );
  console.log(messageBuffer);
} );
// PoolController.on( "actionResponse", function( response ) {
//   console.log( "ACTION RESPONSE - " + response.messageType.name );
// } );


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

PoolController.on( "lightShow", function( state ) {
  console.log( "Light show is " + state );
} );
PoolController.action.startLightShow();
setTimeout( function() {
  PoolController.action.stopLightShow();
}, 60000 );

setInterval( function() {
  PoolController.getPoolStatus( function status( s ) {
    console.log( s.toString() );
  } );
}, 10000 );

// PoolController.action.setSpaTemperature( 104 );
//
// setTimeout( function() {
//   PoolController.action.setSpaTemperature( 110 );
// }, 3000 );
// setTimeout( function() {
//   PoolController.action.setSpaTemperature( 98 );
// }, 10000 );
//
//
// PoolController.action.turnOnWaterfall();
// setTimeout( function() {
//   PoolController.action.turnOffWaterfall();
// }, 20000 );
//
