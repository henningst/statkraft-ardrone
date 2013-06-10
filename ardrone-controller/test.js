var arDrone = require('ar-drone');
var http = require('http');

var client = arDrone.createClient();

var options = {
				host: '127.0.0.1',
				port: 3000,
				path: '/api/raw',
				method: 'POST'
			};

var counter = 0;



var sendTestData = function() {
	counter++;
	var raw_data_header = new Object();

	raw_data_header = {
		header: {
			time: new Date()
			, flying: Math.round(Math.random()*1)
			, sequenceNumber: counter
			, batteryMilliVolt: Math.round(Math.random()*100)
			, altitude: Math.round(Math.random()*10)
			, velocity: {x: Math.round(Math.random()*150)
						, y: Math.round(Math.random()*100)
						, z: Math.round(Math.random()*150)}
			, throttle: {forward: Math.round(Math.random()*10)
						, height: Math.round(Math.random()*10)}
		}
	};

	var data_to_be_sent = JSON.stringify(raw_data_header);

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


	var req = http.request(options, callback);
	console.log("Sending data... (" + counter + ")");

	//This is the data we are posting, it needs to be a string or a buffer
	req.write(data_to_be_sent);
	req.end();



};

setInterval(sendTestData, 1000);
