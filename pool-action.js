var PoolInfo = require( "./pool-info.js" ),
    serialport = require( "serialport" ),
    PoolControllerMessage = require( "./pool-controller-message.js" );

/**
* PoolAction is to be used to create the messages to send to the controll unit
* to activate/deactivate something ( spa, pool, lights, ... )
*/
var poolAction = function PoolAction() {

  var SerialPort = serialport.SerialPort,
      COM_PORT = "/dev/ttyAMA0",
      serialPort = new SerialPort( COM_PORT,
        {
          baudrate: 9600,
          dataBits: 8
        }, false );


  return {
    turnOn: function( device, callback ) {
      this._toggle( device, PoolInfo.ON, callback );
    },
    turnOff: function( device, callback ) {
      this._toggle( device, PoolInfo.OFF, callback );
    },

    _toggle: function( device, isOn, callback ) {
      serialPort.open( function( error ) {
        if ( error ) {
          throw new Error( error );
        } else {
          var _callback = function( args ) {
            serialPort.close();
            callback( args );
          }
          // ok to write now
          var msg = new PoolControllerMessage();
          msg.source = PoolInfo.endPoints.WALL_UNIT;
          msg.destination = PoolInfo.endPoints.INTELLI_SENSE;
          msg.dataBuffer = new Buffer( [ device.id, isOn ] );
          serialPort.write( msg.toBuffer(), _callback );

        }
      });
    }
  };

}

// var action = new poolAction();
// action.turnOn( PoolInfo.devices.WATERFALL, function callback( error ){
//   if ( error ) {
//     console.log( error );
//   } else {
//     console.log( "DID IT" );
//   }
// } );

module.exports = poolAction;
