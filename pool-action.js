var PoolInfo = require( "./pool-info.js" ),
    serialport = require( "serialport" ),
    pcm = require( "./pool-controller-message.js" ),
    PoolControllerMessage = pcm.PoolControllerMessage;

/**
* PoolAction is to be used to create the messages to send to the controll unit
* to activate/deactivate something ( spa, pool, lights, ... )
*/
var poolAction = function PoolAction( /*EventEmitter*/ monitor ) {

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
            if ( monitor ) {
              monitor.emit( isOn ? "deviceOn" : "deviceOff", device );
            }
            if ( callback ) {
              callback( args );
            }
          }
          // ok to write now
          var msg = new PoolControllerMessage();
          msg.source = PoolInfo.endPoints.WALL_UNIT;
          msg.destination = PoolInfo.endPoints.INTELLI_SENSE;
          msg.dataBuffer = new Buffer( [ device.id, isOn ] );
          serialPort.write( msg.toBuffer(), _callback );

        }
      });
    },

    setSpaTemperature: function( temp, callback ) {
      temp = temp > PoolInfo.MAX_TEMP ? PoolInfo.MAX_TEMP : temp;
      var okByte = PoolInfo.messageTypes.HEAT;
      serialPort.open( function( error ) {
        if ( error ) {
          throw new Error( error );
        } else {
          var _callback = function( args ) {
            serialPort.close();
            monitor.emit( "temperatureSet", temp );
            if ( callback ) {
              callback( args );
            }
          }
          // ok to write now
          var msg = new PoolControllerMessage();
          msg.source = PoolInfo.endPoints.WALL_UNIT;
          msg.destination = PoolInfo.endPoints.INTELLI_SENSE;
          // data buffer for heat menu is
          // 1 - pool temp
          // 2 - spa temp setting
          // 3 - spa heat mode (heater or off)
          // 4 - pool mode (heater or off)
          // we never want to heat the pool, so those are going to always be hard coded
          msg.dataBuffer = new Buffer( [ 0x55, temp, PoolInfo.HEATER, PoolInfo.OFF ] );
          var sendMsg = msg.toBuffer( okByte );
          serialPort.write( sendMsg, _callback );
        }
      });
    },

    turnOnSpa: function( callback ) {
      this.turnOn( PoolInfo.devices.SPA, callback );
    },
    turnOffSpa: function( callback ) {
      this.turnOff( PoolInfo.devices.SPA, callback );
    },
    turnOnSpaLight: function( callback ) {
      this.turnOn( PoolInfo.devices.SPA_LIGHT, callback );
    },
    turnOffSpaLight: function( callback ) {
      this.turnOff( PoolInfo.devices.SPA_LIGHT, callback );
    },
    turnOnWaterfall: function( callback ) {
      this.turnOn( PoolInfo.devices.WATERFALL, callback );
    },
    turnOffWaterfall: function( callback ) {
      this.turnOff( PoolInfo.devices.WATERFALL, callback );
    },
    turnOnPoolLight: function( callback ) {
      this.turnOn( PoolInfo.devices.POOL_LIGHT, callback );
    },
    turnOffPoolLight: function( callback ) {
      this.turnOff( PoolInfo.devices.POOL_LIGHT, callback );
    },
    turnOnPoolLight1: function( callback ) {
      this.turnOn( PoolInfo.devices.POOL_LIGHT1, callback );
    },
    turnOffPoolLight1: function( callback ) {
      this.turnOff( PoolInfo.devices.POOL_LIGHT1, callback );
    },
    turnOnPoolLight2: function( callback ) {
      this.turnOn( PoolInfo.devices.POOL_LIGHT2, callback );
    },
    turnOffPoolLight2: function( callback ) {
      this.turnOff( PoolInfo.devices.POOL_LIGHT2, callback );
    },
    turnOnPool: function( callback ) {
      this.turnOn( PoolInfo.devices.POOL, callback );
    },
    turnOffPool: function( callback ) {
      this.turnOff( PoolInfo.devices.POOL, callback );
    },
    turnOnAirBlower: function( callback ) {
      this.turnOn( PoolInfo.devices.AIR_BLOWER, callback );
    },
    turnOffAirBlower: function( callback ) {
      this.turnOff( PoolInfo.devices.AIR_BLOWER, callback );
    },

  };

}

module.exports = poolAction;
