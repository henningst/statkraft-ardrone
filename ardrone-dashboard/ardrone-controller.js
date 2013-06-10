
var ArDroneClient = function() {
	var arDrone = require('ar-drone');
	var logger = require('./ardrone-logger');
	
	var client = arDrone.createClient();
	var flightProgram = require('./ardrone-flightProgram');

	client.config('general:navdata_demo', 'FALSE'); // get all the data
	client.on('navdata', logger.logData);

	var executeFlightProgram = function() {
		flightProgram.execute(client);
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





