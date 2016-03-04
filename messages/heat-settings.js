var PoolInfo = require( "../pool-info.js" );

/**
* This message object is used for handling messages from the PoolController sent back to the wall unit/raspberrypi
*
* Example message:
* pool temperature heat level is set to 85 degrees (55) and is not on (55 5c 04 _00_ )
* spa temperature is set to 92 degrees (5c). the spa heat is on (55 5c _04_ 00 )
*
* <Buffer 00 ff a5 01 0f 10 08 0d 38 38 3e 55 5c 04 00 00 00 4e 64 04 00 02 f3>
* dataBuffer:             <Buffer 38 38 3e 55 5c 04 00 00 00 4e 64 04 00>,
*/
var settings = function HeatSettings( /*PoolControllerMessage*/ pcm ) {

  if ( pcm.check() && pcm.getMessageType() === PoolInfo.messageTypes.HEAT_SETTINGS ) {
    return {
      pool: {
        currentTemp: pcm.dataBuffer[0],
        desiredTemp: pcm.dataBuffer[3],
        willHeat:    pcm.dataBuffer[6] === PoolInfo.HEATER
      },
      spa: {
        currentTemp: pcm.dataBuffer[1],
        desiredTemp: pcm.dataBuffer[4],
        willHeat:    pcm.dataBuffer[5] === PoolInfo.HEATER
      },
      air:  pcm.dataBuffer[2]
    };
  } else {
    console.log("invalid response buffer");
    console.log(pcm);
    throw new Error( "Invalid HeatSettings buffer" );
  }

};

module.exports = settings;
