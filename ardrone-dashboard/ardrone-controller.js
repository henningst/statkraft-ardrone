
var ArDroneClient = function() {
	var arDrone = require('ar-drone');
	var logger = require('./ardrone-logger');
	var client = arDrone.createClient();

	client.config('general:navdata_demo', 'FALSE'); // get all the data
	client.on('navdata', logger.logData);

	var executeFlightProgram = function() {
		console.log('Executing flight program');
		client.animateLeds('blinkGreenRed', 5, 10);
		client.takeoff();
		client
		  //.after(5000, function() {
		  //  this.clockwise(0.5);
		  //})
		  //.after(3000, function() {
		  //  this.animate('flipLeft', 15);
		  //})
		  .after(5000, function() {
		    this.stop();
		    this.land();
		  });
	}

	var logData = function(data) {
		console.log('logging');		
	}

	return {
		takeoff: function() { 
			executeFlightProgram();
		}
	}
}


exports.takeoff = function() {
	// Create new client or reuse one already created
	// Must be singleton because only 1 client can connect
	// to the wifi access point
	if(typeof global.ardroneclient == 'undefined') {
		global.ardroneclient = new ArDroneClient();
	}	
	
	global.ardroneclient.takeoff();
};


















 