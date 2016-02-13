var PoolMode = require( "./pool-mode.js" ),
    pcm = require( "./pool-controller-message.js" ),
    PoolStatus = require( "./pool-status.js" ),
    PoolControllerMessage = pcm.PoolControllerMessage,
    EventEmitter = require("events").EventEmitter,
    PoolAction = require( "./pool-action.js" ),
    PoolInfo = require( "./pool-info.js" ),
    util = require("util");

function PoolMonitor() {
  EventEmitter.call( this );
}
util.inherits( PoolMonitor, EventEmitter );


var poolController = function () {
  var monitor = new PoolMonitor();
  var poolAction = new PoolAction( monitor );

  return {
    messageBuffer: null,
    working: false,
    currentMessageType: null,
    action: poolAction,
    supportedMessageTypes: {

      poolControllerMessage: {
        name: pcm.name,
        preamble: pcm.preamble,
        indexOfDataLengthByte: pcm.indexOfDataLengthByte,

        handleIt: function( messageBuffer ) {
          var msg = new PoolControllerMessage( messageBuffer );
          if ( msg.check() ) {
            if ( msg.dataLength === 0x1d && msg.getMessageType() === PoolInfo.messageTypes.STATUS ) {
              var status = new PoolStatus( msg );
              monitor.emit( "status", status );
            } else if ( msg.getMessageType() === PoolInfo.messageTypes.HEAT ) {
              // we are setting the heat options
              monitor.emit( "heater", "TODO: construct a heater message object and return it here", messageBuffer );
            } else if ( msg.getMessageType() === PoolInfo.messageTypes.RESPONSE ) {
              monitor.emit( "actionResponse", "TODO: construct a response message object and return it", messageBuffer );
            } else {
              // don't handle this one yet
              var unknown = {
                message: msg,
                buffer: messageBuffer
              }
              monitor.emit( "unknown message", unknown );
            }
          } else {
            var err = {
              text: "PoolControllerMessage failed checksum validation",
              message: msg,
              buffer: messageBuffer
            };
            monitor.emit( "error", err );
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
            monitor.emit( "start message", msgType );
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
            monitor.emit( "end message", this.currentMessageType );

            // clean up and prepare for another
            this.working = false;
          }
        }
      } else {
        monitor.emit( "waiting", null );
        // console.log( "Waiting for a new message..." );
      }
    },

    on: function( event, callback ) {
      monitor.on( event, callback );
    },
    once: function() {
      monitor.once( event, callback );
    },
    removeListener: function( event, callback ) {
      monitor.removeListener( event, callback );
    },

    getPoolStatus: function( callback ) {
      monitor.once( "status", function( /*PoolStatus*/ poolStatus ) {
        callback( poolStatus );
      } );
    }
  }
}

module.exports = new poolController();
