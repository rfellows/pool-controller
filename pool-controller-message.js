var detectEquipment = function( id ) {
  var name;
  switch( id ) {
    case 0x10:
      name = "IntelliSense Controller";
      break;
    case 0x0f:
      name = "Wall Unit";
      break;
    default:
      name: "Unknown";
  }

  return {
    id: id,
    name: name
  };
}

var message = function PoolControllerMessage( /*Buffer*/ buffer ) {
  var source, dest, msgLength, data, checksum, offset, checksumOffset, hour, minute;

  source = detectEquipment( buffer[5] );
  dest = detectEquipment( buffer[4] );
  msgLength = buffer[7];
  offset = 8;
  checksumOffset = offset + msgLength;

  data = buffer.slice( offset, msgLength + offset );

  checksum = buffer.slice( checksumOffset, checksumOffset + 2 );

  return {
    source: source,
    destination: dest,
    dataLength: msgLength,       // the length of the actual message
    dataBuffer: data,            // the buffer of the actual message
    checksum: checksum,

    /* verify the checksum */
    check: function() {
      // add up the bytes in the dataBuffer
      var total = 0;
      for (var value of data.values() ) {
        total += value;
      }

      // need to add the bytes leading up to the data buffer as well
      for ( var idx = 2; idx < offset; idx++ ) {
        total += buffer[idx];
      }

      // calculate checksum by multiplying the highorder byte by 256 and adding it to the low order byte
      var checkTotal = checksum[0] * 256 + checksum[1];
      //console.log( "Expected: " + checkTotal + "   Actual: " + total );
      return total === checkTotal;
    }

  };

}

module.exports = message;
