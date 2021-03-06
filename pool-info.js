var poolInfo = {
  ON: 0x01,
  OFF: 0x00,
  HEATER: 0x04,
  MAX_TEMP: 0x68,  // 104 degrees
  COLOR_SWIM: 0x90,
  devices : {
    SPA:           { id : 0x01, hex : 0x01, name : "Spa" },
    POOL_LIGHT:    { id : 0x02, hex : 0x02, name : "Pool light" },
    POOL_LIGHT1:   { id : 0x03, hex : 0x04, name : "Pool light 1" },
    POOL_LIGHT2:   { id : 0x04, hex : 0x08, name : "Pool light 2"},
    SPA_LIGHT:     { id : 0x05, hex : 0x10, name : "Spa light"},
    POOL:          { id : 0x06, hex : 0x20, name : "Pool"},
    WATERFALL:     { id : 0x07, hex : 0x40, name : "Waterfall"},
    AIR_BLOWER:    { id : 0x08, hex : 0x80, name : "Air blower"}
  },

  endPoints : {
    BROADCAST:     { id: 0x0f, name: "Broadcast" },
    WALL_UNIT:     { id: 0x20, name: "Wall unit" },
    INTELLI_SENSE: { id: 0x10, name: "IntelliSense controller" },
    SPA_REMOTE:    { id: null, name: "Spa-side remote" }
  },

  messageTypes: {
    RESPONSE:      { id: 0x01, name: "Response" },
    STATUS:        { id: 0x02, name: "Status" },
    HEAT:          { id: 0x88, name: "Heat" },
    HEAT_MENU:     { id: 0xc8, name: "Heat Menu" },
    HEAT_SETTINGS: { id: 0x08, name: "Heat Settings" },
    DEVICE_TOGGLE: { id: 0x86, name: "Device toggle" },
    LIGHTS       : { id: 0x60, name: "Lights" },
    CLOCK        : { id: 0x85, name: "Clock" }
  },

  dayOfWeek: [
    { hex: 0x01, name: "Sunday" },
    { hex: 0x02, name: "Monday" },
    { hex: 0x04, name: "Tuesday" },
    { hex: 0x08, name: "Wednesday" },
    { hex: 0x10, name: "Thursday" },
    { hex: 0x20, name: "Friday" },
    { hex: 0x40, name: "Saturday" },
  ], 

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
  },

  getMessageTypeByName: function( name ) {
    for( key in this.messageTypes ) {
      var mt = this.messageTypes[key];
      if ( name.toUpperCase() === mt.name.toUpperCase() ) {
        return mt;
      }
    }
    return null;
  },

  getMessageTypeById: function( id ) {
    for( key in this.messageTypes ) {
      var mt = this.messageTypes[key];
      if ( id === mt.id ) {
        return mt;
      }
    }
    return null;
  }

}

module.exports = poolInfo;
