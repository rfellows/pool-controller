var express = require('express');
var router = express.Router();

var PoolController = require( "../../pool-controller.js" );
var PoolInfo = require( "../../pool-info.js" );

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get("/status", function status( request, response, next ) {
  if ( !PoolController.isRunning ) {
    PoolController.start();
  }
  PoolController.getPoolStatus( function( status ) {
    status.date = status.time();
    status.activeDevices = status.poolMode.getActiveEquipment();
    response.send( status );
    PoolController.stop();
  } );
} );

router.get( "/devices", function( request, response, next ) {
  response.send( PoolInfo.devices );
} );

router.put( "/device/:name/on", function( request, response, next ) {
  var name = request.params.name.replace(/\+/g, " ");
  console.log("Turning on " + name);
  var device = PoolInfo.getDeviceByName( name );
  PoolController.action.turnOn( device, function() {
    response.sendStatus(200);
  } );
} );

router.put( "/device/:name/off", function( request, response, next ) {
  var name = request.params.name.replace(/\+/g, " ");
  console.log("Turning off " + name);
  var device = PoolInfo.getDeviceByName( name );
  PoolController.action.turnOff( device, function() {
    response.sendStatus(200);
  } );
} );

router.put( "/temp/:degrees", function( request, response, next ) {
  console.log( "Setting the spa to " + request.params.degrees );

  PoolController.action.setSpaTemperature( request.params.degrees, function() {
    response.sendStatus(200);
  } );
} );

router.get( "/temp", function( request, response, next ) {
  console.log( "Getting the tempurature settings" );

  if ( !PoolController.isRunning ) {
    PoolController.start();
  }
  PoolController.getHeatStatus( function( tempSettings ) {
    response.send( tempSettings );
    PoolController.stop();
  } );
} );

module.exports = router;
