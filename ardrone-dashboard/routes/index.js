//var io = require('socket.io');

exports.index = function(req, res){
  res.render('index', { });
};

exports.raw = function(req, res){
	if(req.body.header){

		//console.dir(req);
		console.log("Received message ("+req.body.header.sequenceNumber+")");

		var header = new Object();
		header.rawData = req.body.header;

		// send on socket.io
		req.speed.emit('speed', { value: header.rawData.velocity });
		req.altitude.emit('altitude', {value: header.rawData.altitude});
		req.flying.emit('flying', { value: header.rawData.flying});

		res.json({message: "Success"});

	}else{
		console.log("No header received.");
		res.json({message: "No header received."});
	}
}

