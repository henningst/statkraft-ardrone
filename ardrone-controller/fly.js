var arDrone = require('ar-drone');
var http = require('http');
var client = arDrone.createClient();

var options = {host: '127.0.0.1'
				, port: 3000
				, path: '/api/raw'
				, method: 'POST'};

var counter = 0;
var requestCounter = 0;

client.config('general:navdata_demo', 'FALSE'); // get all the data

client.animateLeds('blinkGreenRed', 5, 10);
/*
var PaVEParser = require('./node_modules/ar-drone/lib/video/PaVEParser');
var output = require('fs').createWriteStream('.vid.h264');

var video = client.getVideoStream();
var parser = new PaVEParser();
parser
	.on('data', function(data) {
		output.write(data.palyoad);
	})
	.on('end', function() {
		output.end();
	});

video.pipe(parser);
*/

client.takeoff();

client
	.after(5000, function() {
		this.stop();
		this.land();
	});

client.on('navdata', function(data){
	counter = counter + 1;

	if(counter > 100){
		counter = 0;
		var raw_data_header = new Object();
		console.dir(data);
		if(data.rawMeasures && data.demo && data.pwm){

			raw_data_header = {
				header: {
					time: data.time
					, controlState: data.demo.controlState /* controlState: 'CTRL_LANDED', */
					, sequenceNumber: data.sequenceNumber
					, flying: data.droneState.flying /* flying: 0 */
					, batteryPercentage: data.demo.batteryPercentage
					, batteryMilliVolt: data.rawMeasures.batteryMilliVolt
					, clockwiseDegrees: data.demo.clockwiseDegrees
					, altitude: data.demo.altitude *100
					, velocity: {x: data.demo.xVelocity
								, y: data.demo.yVelocity
								, z: data.demo.zVelocity}
					, throttle: {forward: data.pwm.gazFeedForward
								, height: data.pwm.gazAltitude}
				}
			};
		}else{
			raw_data_header = {
				header: {
					time: data.time
					, sequenceNumber: data.sequenceNumber
					, flying: data.droneState.flying
					, batteryMilliVolt: 0
					, altitude: 0
					, velocity: {x: 0
								, y: 0
								, z: 0}
					, throttle: {forward: 0
								, height: 0}
				}
			};
		}

		var data_to_be_sent = JSON.stringify(raw_data_header);
		var headers = {
			'Content-Type': 'application/json'
			, 'Content-Length': data_to_be_sent.length
		};
		options.headers = headers;


		callback = function(response) {
		  var str = ''
		  response.on('data', function (chunk) {
		    str += chunk;
		  });

		  response.on('end', function () {
		    console.log(str);
		  });
		}

		var headers = {
			'Content-Type': 'application/json'
			, 'Content-Length': data_to_be_sent.length
		};
		options.headers = headers;

		requestCounter++;
		
		var req = http.request(options, callback);
		console.log("Sending data... (" + requestCounter + ")");

		//This is the data we are posting, it needs to be a string or a buffer
		req.write(data_to_be_sent);
		req.end();

	}

});
