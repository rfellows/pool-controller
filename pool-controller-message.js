var PoolInfo = require( "./pool-info.js" );

var pcm = {
  name: "PoolControllerMessage",
  preamble: new Buffer( [ 0x00, 0xff, 0xa5 ] ),
  indexOfDataLengthByte: 7,
  indexOfSourceByte: 5,
  indexOfDestByte: 4,

  PoolControllerMessage: function( /*Buffer*/ buffer ) {
    var source, dest, msgLength, data, checksum, offset, checksumOffset, hour, minute;

    var _detectEquipment = function( id ) {
      var endPoint = { id: id, name: "Unknown" };

      for( var key in PoolInfo.endPoints ) {
        if ( id === PoolInfo.endPoints[key].id ) {
          endPoint = PoolInfo.endPoints[key];
          break;
        }
      }

      return endPoint;
    }

    if ( buffer ) {
      source = _detectEquipment( buffer[pcm.indexOfSourceByte] );
      dest = _detectEquipment( buffer[pcm.indexOfDestByte] );
      msgLength = buffer[pcm.indexOfDataLengthByte];
      offset = 8;
      checksumOffset = offset + msgLength;

      data = buffer.slice( offset, msgLength + offset );

      checksum = buffer.slice( checksumOffset, checksumOffset + 2 );
    } else {
      // most likely a write buffer is being constructed
      offset = 2;
    }

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
        for (var value of this.dataBuffer.values() ) {
          total += value;
        }

        if ( offset ) {
          // need to add the bytes leading up to the data buffer as well
          for ( var idx = 2; idx < offset; idx++ ) {
            total += buffer[idx];
          }
        }

        // calculate checksum by multiplying the highorder byte by 256 and adding it to the low order byte
        var checkTotal = this.checksum[0] * 256 + this.checksum[1];
        // console.log( "Expected: " + checkTotal + "   Actual: " + total );
        return total === checkTotal;
      },

      detectEquipment: function( id ) {
        return _detectEquipment( id );
      },

      /**
      * Use this to get a buffer that can be used to write back using the members of the object
      */
      toBuffer: function() {
        var bytes = new Buffer( [ 0x01, this.destination.id, this.source.id, 0x86, this.dataBuffer.length & 0xff ] );
        var buffNoCheck = Buffer.concat( [ pcm.preamble, bytes, this.dataBuffer ],
          pcm.preamble.length + bytes.length + this.dataBuffer.length );

        this.checksum = this.calculateChecksum( buffNoCheck );
        var buffer = Buffer.concat( [ buffNoCheck, this.checksum ], buffNoCheck.length + this.checksum.length );
        return buffer;
      },

      calculateChecksum: function( buffer ) {
        // add up the bytes in the dataBuffer
        var total = 0;
        var vals = buffer.values();
        var i = 0;
        for (var value of buffer.values() ) {
          if ( i++ >= offset ) {
            total += value;
          }

        }
        // console.log(total);
        var byte1 = total >> 8,
            byte2 = total & 0xff;

        var chk = new Buffer( [ byte1, byte2 ] );
        // console.log( chk );
        return chk;
      }

    };

  }
}

module.exports = pcm;
