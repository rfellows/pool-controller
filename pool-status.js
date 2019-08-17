var poolControllerMessage = require( "./pool-controller-message.js" );
var moment = require( "moment" );
var PoolMode = require( "./pool-mode.js" );

var PoolControllerMessage = poolControllerMessage.PoolControllerMessage;

// dataBuffer: <Buffer 0c 0b 20 00 00 00 00 00 00 20 00 00 00 00 47 47 00 00 45 00 00 00 04 04 00 7f 60 01 02>,

var poolStatus = function PoolStatus( /*PoolControllerMessage*/ pcm ) {
//  console.log(pcm);
  if ( pcm.check() && pcm.dataLength === 0x1d ) {
    var hour = pcm.dataBuffer[0];
    var minute = pcm.dataBuffer[1];
    var mode = new PoolMode( pcm.dataBuffer[2] );
    var poolTemp = pcm.dataBuffer[14];
    var spaTemp = pcm.dataBuffer[15];
    var airTemp = pcm.dataBuffer[18];

    var status = {
      poolMode: mode,
      temperature: {
        pool: poolTemp,
        spa: spaTemp,
        air: airTemp
      },
      hour: hour,
      minute: minute,

      time: function() {
        return moment( { hour: hour, minute: minute } ).format( "MM-DD-YYYY hh:mm a" );
      },

      toString() {

        var s = "=================================================\n";
           s += "Message from: " + pcm.source.name + "\n";
           s += "Message to:   " + pcm.destination.name + "\n";
           s += this.poolMode.toString();
           s += "Air temp is " + this.temperature.air + "\n";
           s += "Pool temp is " + this.temperature.pool + "\n";
           s += "Spa temp is " + this.temperature.spa + "\n";
           s += this.time() + "\n";
           s += "=================================================\n"; 
        return s;
      }

    };
    //console.log('status', status);
    return status;
  } else {
    throw new Error("Invalid PoolControllerMessage. It is not a PoolStatus type");
  }

};

module.exports = poolStatus;
