var PoolInfo = require( "./pool-info.js" ),
    serialport = require( "serialport" ),
    pcm = require( "./pool-controller-message.js" ),
    PoolControllerMessage = pcm.PoolControllerMessage,
    Random = require("random-js"),
    random = new Random(Random.engines.mt19937().autoSeed());

/**
* PoolAction is to be used to create the messages to send to the controll unit
* to activate/deactivate something ( spa, pool, lights, ... )
*/
var poolAction = function PoolAction( /*EventEmitter*/ eventEmitter ) {

  var SerialPort = serialport.SerialPort,
      COM_PORT = "/dev/ttyAMA0",
      serialPort = new SerialPort( COM_PORT,
        {
          baudrate: 9600,
          dataBits: 8
        }, false ),
      monitor = eventEmitter;


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
          serialPort.close();
          throw new Error( error );
        } else {
          var _callback = function( args ) {
            serialPort.close();
            if ( monitor ) {
              monitor.emit( "temperatureSet", temp );
            }
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

    asForHeatMenu: function( callback ) {
      var okByte = PoolInfo.messageTypes.HEAT_MENU;
      serialPort.open( function( error ) {
        if ( error ) {
          serialPort.close();
          throw new Error( error );
        } else {
          var _callback = function( args ) {
            serialPort.close();
            console.log("asked for heat menu");
            if ( callback ) {
              callback( args );
            }
          }
          // ok to write now
          var msg = new PoolControllerMessage();
          msg.source = PoolInfo.endPoints.WALL_UNIT;
          msg.destination = PoolInfo.endPoints.INTELLI_SENSE;
          msg.dataBuffer = new Buffer( [ 0x00 ] );
          var sendMsg = msg.toBuffer( okByte );
          // console.log(sendMsg);
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

    startLightShow: function() {
      var that = this;
      if ( monitor ) {
        monitor.emit( "lightShow", "on" );
      }
      var lightOn = [
        { isOn: false,
          device: PoolInfo.devices.POOL_LIGHT
        },
        { isOn: false,
          device: PoolInfo.devices.POOL_LIGHT1
        },
        { isOn: false,
          device: PoolInfo.devices.POOL_LIGHT2
        }
      ];
      try {
        that.lightShow = setInterval( function() {
          for( var i = 0; i < 3; i++ ) {

            if ( !lightOn[i].isOn ) {
              lightOn[i].isOn = true;

              var rnd1 = random.integer(200, 10000);
              var rnd2 = random.integer(1000, 30000);

              setTimeout( function( on ) {
                // console.log("Turning on " + on.device.name);
                that.turnOn( on.device, function() {
                  // now that it's on, let's turn it off in a bit
                  setTimeout( function ( off ) {
                    // console.log("Turning off " + off.device.name);
                    that.turnOff( off.device );
                    off.isOn = false;
                  }, rnd2, on );
                } );
              }, rnd1, lightOn[i] )
            }
          }
        }, 1000 );
      } catch ( error ) {
        console.log( error );
        this.stopLightShow();
      }
    },

    stopLightShow: function() {
      clearInterval( this.lightShow );
      this.turnOffPoolLight();
      this.turnOffPoolLight1();
      this.turnOffPoolLight2();
      if ( monitor ) {
        monitor.emit( "lightShow", "off" );
      }
    }
  };

}

module.exports = poolAction;
