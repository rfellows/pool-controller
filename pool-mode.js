
var poolmode = function PoolMode( /*Hex*/ hexMode ) {
    
  var modes = {
    SPA:          { hex : 0x01, name : "Spa" },
    POOL_LIGHT:   { hex : 0x02, name : "Pool light" },
    POOL_LIGHT1:  { hex : 0x04, name : "Pool light 1" },
    POOL_LIGHT2:  { hex : 0x08, name : "Pool light 2"},
    SPA_LIGHT:    { hex : 0x10, name : "Spa light"},
    POOL:         { hex : 0x20, name : "Pool"},
    WATERFALL:    { hex : 0x40, name : "Waterfall"},
    AIR_BLOWER:   { hex : 0x80, name : "Air blower"}
  };

  return {
    mode: hexMode,
    
    toString: function() {
      var s = "";
      for( var key in modes ) {
        var mode = modes[key];
        
        if( hexMode & mode.hex ) {
          s += mode.name + " is on.\n";
        }
      }
      
      if(!s) {
        s = "Everything is off.\n";
      }
      
      return s;
    }
    
  };

};

module.exports = poolmode;