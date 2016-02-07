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

var processor = {
  messageBuffer: null,
  working: false,
  currentMessageType: null,
  supportedMessageTypes: {
    poolControllerMessage: {
      name: "PoolControllerMessage",
      preamble: new Buffer( [ 0x00, 0xff, 0xa5 ] ),
      indexOfDataLengthByte: 7,
      handleIt: function( messageBuffer ) {
        var msg = new PoolControllerMessage( messageBuffer );

        if ( msg.check() ) {
          if ( msg.dataLength === 0x1d ) {
            var status = new PoolStatus( msg );
            console.log( status.toString() );
          } else {
            // don't handle this one yet
            console.log( "Unsupported PoolControllerMessage" );
            console.log( messageBuffer );
          }
        } else {
          console.log( "PoolControllerMessage failed checksum validation" );
          console.log( messageBuffer );
        }
      }
    }
  },
  read: function( buffer ) {
    // if we aren't working on a message already, look for the start of a new one
    if ( !this.working ) {
      for( i in this.supportedMessageTypes ) {
        var msgType = this.supportedMessageTypes[i],
            offset = buffer.indexOf( msgType.preamble );
        if ( offset > -1 ) {
          // we've found a matching message type, start working on it
          this.working = true;
          this.messageBuffer = buffer.slice( offset, buffer.length );
          this.currentMessageType = msgType;
          console.log( "\nBegin processing a new message: " + this.currentMessageType.name );
          break;
        }
      }
    } else {
      this.messageBuffer = Buffer.concat( [ this.messageBuffer, buffer ], this.messageBuffer.length + buffer.length );
    }

    if ( this.working ) {
      // find out if we are done reading this message or not
      var idx = this.currentMessageType.indexOfDataLengthByte;
      if ( this.messageBuffer.length > idx ) {
        // add up the data length, plus the header info and the checksum length
        var totalMsgLength = idx + this.messageBuffer[idx] + 2;
        if ( this.messageBuffer.length >= totalMsgLength ) {
          // we are done with this message
          // process it
          this.currentMessageType.handleIt( this.messageBuffer );
          // clean up and prepare for another
          this.working = false;
        }
      }
    } else {
      console.log( "Waiting for a new message..." );
    }
  }
}

serialPort.open( function( error ) {

  if( error ) {
    console.log( "Failed to open: " + error );
  } else {
    console.log( "Opened: " + COM );

    serialPort.on( "data", function( data ) {
      if( data.length > 1 ) {
        processor.read( data );
      }
    } );
  }
} );
