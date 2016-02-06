var serialport = require( "serialport" );
var SerialPort = serialport.SerialPort;

var PoolMode = require( "./pool-mode.js" );
var PoolControllerMessage = require( "./pool-controller-message.js" );
var PoolStatus = require( "./pool-status.js" );

var COM = "/dev/ttyAMA0";

var serialPort = new SerialPort( COM,
  {
    baudrate: 9600,
    dataBits: 8
  }, false );

var preamble = new Buffer( [ 0x00, 0xff, 0xa5 ] );

serialPort.open( function( error ) {

  if( error ) {
    console.log( "Failed to open: " + error );
  } else {
    console.log( "Opened: " + COM );

    var messageBuffer = new Buffer([]);

    serialPort.on( "data", function( data ) {
      if( data.length > 1 ) {
        //console.log(data);

        var len = data.length;

        var offset = null;

        // find the start of the message
        offset = data.indexOf( preamble );

        var dataString = "";
        if ( offset != null && offset > -1 ) {
          if( messageBuffer.length > 0 ) {
            var end = data.slice(0, offset);
            messageBuffer = Buffer.concat( [messageBuffer, end], messageBuffer.length + end.length );
            //console.log( messageBuffer.toJSON() );

            var msg = new PoolControllerMessage( messageBuffer );

            console.log( messageBuffer );
            if ( msg.check() ) {
              //console.log(msg);
              if ( msg.dataLength === 0x1d ) {
                var status = new PoolStatus( msg );
                console.log(status.toString());
                //console.log( status.time() );
              }
            } else {
              console.log( "Unknown message, failed checksum validation" );
            }
          }

          //start building up a new message buffer
          messageBuffer = new Buffer([]);
          var start = data.slice( offset, data.length );

          messageBuffer = Buffer.concat( [messageBuffer, start], messageBuffer.length + start.length );

        } else {
          messageBuffer = Buffer.concat( [messageBuffer, data], messageBuffer.length + data.length )
        }

      }
    } );
  }
} );
