var PoolInfo = require( "./pool-info.js" );

/**
* This message object is used for handling messages from the PoolController sent back to the wall unit/raspberrypi
*
* Example message: this one is saying the Heat settings (0x88) were successful
* <Buffer 00 ff a5 01 20 10 01 01 88 01 60>
*/
var response = function PoolResponse( /*PoolControllerMessage*/ pcm ) {

  if ( pcm.check() && pcm.getMessageType() === PoolInfo.messageTypes.RESPONSE ) {
    return pcm.dataBuffer[0] === 0x01;
  } else {
    console.log("invalid response buffer");
    console.log(pcm);
    throw new Error( "Invalid PoolResponse buffer" );
  }
};
  
module.exports = response;
