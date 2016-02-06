var PoolControllerMessage = require( "./pool-controller-message.js" );
var moment = require( "moment" );
var PoolMode = require( "./pool-mode.js" );

var poolStatus = function PoolStatus( /*PoolControllerMessage*/ pcm ) {
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
      
      time: function() {
        return moment( { hour: hour, minute: minute } ).format( "MM-DD-YYYY hh:mm a" );
      },
      
      toString() {
      
        var s = this.poolMode.toString();
        s += "Air temp is " + this.temperature.air + "\n";
        s += "Pool temp is " + this.temperature.pool + "\n";
        s += "Spa temp is " + this.temperature.spa + "\n";
        s += this.time();
        return s;
      }
    
    };
    
    return status;
  } else {
    throw new Error("Invalid PoolControllerMessage. It is not a PoolStatus type");
  }

};

module.exports = poolStatus;