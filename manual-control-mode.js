var serialport = require( "serialport" );
var SerialPort = serialport.SerialPort;

var pc = require( "./pool-controller.js" );
var PoolInfo = require( "./pool-info.js" );

var COM = "/dev/ttyAMA0";

var serialPort = new SerialPort( COM,
  {
    baudrate: 9600,
    dataBits: 8
  }, false );


serialPort.open( function( error ) {

  if( error ) {
    console.log( "Failed to open: " + error );
  } else {
    console.log( "Opened: " + COM );

    serialPort.on( "data", function( data ) {
      if( data.length > 1 ) {
        pc.read( data );
      }
    } );
  }
} );


// NEED A REPL -- require("repl")
