var PoolInfo = require( "../pool-info.js" ),
    pcm = require( "../pool-controller-message.js" ),
    PoolControllerMessage = pcm.PoolControllerMessage;

/**
* This message object is used for turning on/lights and color swim mode
*
* Example message:
*   ALL ON:      <Buffer 00 ff a5 01 10 20 60 02 01 00 01 39>
*
*   COLOR SWIM:  <Buffer 00 ff a5 01 10 20 60 02 90 00 01 c8>
*
*   ALL OFF:     <Buffer 00 ff a5 01 10 20 60 02 00 00 01 38>
*/
var lightCommand = function() {
  var buildLightMessage = function( type ) {
    var msg = new PoolControllerMessage();
    msg.source = PoolInfo.endPoints.WALL_UNIT;
    msg.destination = PoolInfo.endPoints.INTELLI_SENSE;
    msg.dataBuffer = new Buffer( [ type, 0x00 ] );
    var sendMsg = msg.toBuffer( PoolInfo.messageTypes.LIGHTS );
    console.log("LIGHT MSG:");
    console.log(sendMsg);
    return sendMsg;
  };

  return {
    getAllOnMessage: function() {
      return buildLightMessage( PoolInfo.ON );
    },

    getAllOffMessage: function() {
      return buildLightMessage( PoolInfo.OFF );
    },

    getColorSwimMessage: function() {
      return buildLightMessage( PoolInfo.COLOR_SWIM );
    }
  }

}


module.exports = new lightCommand();
