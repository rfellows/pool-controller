var PoolInfo = require( "../pool-info.js" ),
    pcm = require( "../pool-controller-message.js" ),
    moment = require( "moment" ),
    PoolControllerMessage = pcm.PoolControllerMessage;

/**
* This message object is used setting the current day/time
*
* Example message:
*   <Buffer 00 ff a5 01 10 20 85 08 0e 27 01 01 01 00 00 01 01 9c>
*/
var clockCommand = function() {
  var buildClockMessage = function( hours, minutes, dayOfWeek, dayOfMonth, month, year ) {
    var msg = new PoolControllerMessage();
    msg.source = PoolInfo.endPoints.WALL_UNIT;
    msg.destination = PoolInfo.endPoints.INTELLI_SENSE;
    msg.dataBuffer = new Buffer( [ hours, minutes, dayOfWeek, dayOfMonth, month, year, 0x00, 0x01 ] );
    var sendMsg = msg.toBuffer( PoolInfo.messageTypes.CLOCK );
    console.log("CLOCK MSG:");
    console.log(sendMsg);
    return sendMsg;
  };

  return {
    syncDateTime: function() {
      console.log( "Setting the clock to now (" + moment().format("HH:mm ddd MMM D YYYY") + ")" );
      console.log("hours " + moment().hours());
      console.log("minutes " + moment().minutes());
      console.log("day " + moment().day() + 1);
      console.log("date " + moment().date() + 1);
      console.log("month " + moment().month() + 1);
      console.log("year " + (2000 - moment().year() ));


      return buildClockMessage( moment().hours(),
        moment().minutes(),
        moment().day() + 1,
        moment().date() + 1,
        moment().month() + 1,
        2000 - moment().year());
    },
  };

};


module.exports = new clockCommand();
