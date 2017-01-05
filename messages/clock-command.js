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
      var now = moment();
      var dayOfWeek = now.day();
      
      console.log( "Setting the clock to now (" + moment().format("HH:mm ddd MMM D YYYY") + ")" );
      console.log("hours " + now.hours());
      console.log("minutes " + now.minutes());
      console.log("day " + dayOfWeek );
      console.log("date " + now.date());
      console.log("month " + (now.month() + 1));
      console.log("year " + (now.year()-2000) );

      return buildClockMessage( now.hours(),
        now.minutes(),
        PoolInfo.dayOfWeek[dayOfWeek].hex,
        now.date(),
        ( now.month() + 1 ),
        ( now.year() - 2000 ) );
    },
  };

};


module.exports = new clockCommand();
