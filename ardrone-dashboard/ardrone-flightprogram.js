exports.execute = function(client) {

		console.log('Executing flight program');

		client.animateLeds('blinkGreenRed', 5, 10);
		client.takeoff();
		client
		  .after(1000, function() {
		    this.stop();
		    this.land();
		  });
}