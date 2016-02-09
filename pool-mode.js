var PoolInfo = require ( "./pool-info.js" );

/**
* PoolMode is intended to be used to decode the pool mode byte from a PoolStatus message into
* what is actually on.
*/
var poolmode = function PoolMode( /*Hex*/ hexMode ) {

  return {
    mode: hexMode,

    getActiveEquipment: function() {
      var whatsOn = new Array();
      for( var key in PoolInfo.devices ) {
        var mode = PoolInfo.devices[key];

        if( hexMode & mode.hex ) {
          whatsOn.push( mode );
        }
      }
      return whatsOn;
    },

    toString: function() {
      var s = "";
      var active = this.getActiveEquipment();

      if ( active.length > 0 ) {
        for( var i in active ) {
          var mode = active[i];
          s += active[i].name + " is on.\n";
        }
      } else {
        s = "Everything is off.\n";
      }
      return s;
    }

  };

};

module.exports = poolmode;
