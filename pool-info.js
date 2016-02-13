var poolInfo = {
  ON: 0x01,
  OFF: 0x00,
  HEATER: 0x04,
  MAX_TEMP: 0x68,  // 104 degrees
  devices : {
    SPA:          { id : 0x01, hex : 0x01, name : "Spa" },
    POOL_LIGHT:   { id : 0x02, hex : 0x02, name : "Pool light" },
    POOL_LIGHT1:  { id : 0x03, hex : 0x04, name : "Pool light 1" },
    POOL_LIGHT2:  { id : 0x04, hex : 0x08, name : "Pool light 2"},
    SPA_LIGHT:    { id : 0x05, hex : 0x10, name : "Spa light"},
    POOL:         { id : 0x06, hex : 0x20, name : "Pool"},
    WATERFALL:    { id : 0x07, hex : 0x40, name : "Waterfall"},
    AIR_BLOWER:   { id : 0x08, hex : 0x80, name : "Air blower"}
  },

  endPoints : {
    BROADCAST:     { id: 0x0f, name: "Broadcast" },
    WALL_UNIT:     { id: 0x20, name: "Wall unit" },
    INTELLI_SENSE: { id: 0x10, name: "IntelliSense controller" },
    SPA_REMOTE:    { id: null, name: "Spa-side remote" }
  },
  messageTypes: {
    RESPONSE: 0x01,
    STATUS: 0x02,
    HEAT: 0x88
  },
  getDeviceByName: function( name ) {
    for( key in this.devices ) {
      var device = this.devices[key];
      if ( name.toUpperCase() === device.name.toUpperCase() ) {
        return device;
      }
    }
    return null;
  },

  getEndpointByName: function( name ) {
    for( key in this.endPoints ) {
      var ep = this.endPoints[key];
      if ( name.toUpperCase() === ep.name.toUpperCase() ) {
        return ep;
      }
    }
    return null;
  }
}

module.exports = poolInfo;
