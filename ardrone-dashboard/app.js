var express = require('express')
	, path = require('path')
	, routes = require('./routes')
	, http = require('http')
	, mongoose = require('mongoose')
	, db
	, passport = require('passport')
	, LocalStrategy = require('passport-local').Strategy
	, server
	, io = require('socket.io')
	, altitude
	, flying
	, heading
	, speed
	, throttle_vertical
	, throttle_horizontal
	, battery
	, header
	, takeOff
	, gate_counter
	, droneController = require('./ardrone-controller');

var app = express();
var MongoStore = require('connect-mongo')(express); // persistent sessions

setupApp();

function setupApp(){
	gate_counter = 0;
	app.configure(function(){
		app.set('port', process.env.PORT || 3000);
		app.set('views', __dirname + '/views');
		app.set('view engine', 'ejs');
		app.use(express.favicon());
		app.use(express.static(path.join(__dirname, 'public')));
		app.use(express.logger('dev'));
		app.use(express.cookieParser());
		app.use(express.bodyParser());
		app.use(express.methodOverride());
	});

	app.use(app.router);

	setupRoutes();
	startServer();
}

function setupRoutes(){
	app.get('/', routes.index);

	app.post('/api/raw', /*passTheGate,*/ addDb, addAltitude, addSpeed, addFlying, /*addHeading, addThrottleVertical, addThrottleHorizontal, addBattery,*/ routes.raw);
	app.post('/api/takeoff', doTakeOff, routes.raw);

	app.get('*', function(req, res){
		console.log("Page not found: " + req.originalUrl);
		res.render('404');
	});
}

function doTakeOff(req, res, next) {
	console.log("Received take off command!")
	droneController.takeoff();
	next();
}

function addDb(req, res, next){
	req.db = db;
	next();
}

function addFlying(req, res, next) {
	console.log("Getting flying");
	req.flying = flying;
	next();
}
function addAltitude(req, res, next){
	console.log("Getting altitude");
	req.altitude = altitude;
	next();
}

function addSpeed(req, res, next){
	console.log("Getting speed in " + req);
	req.speed = speed;
	next();
}

function addSocketIO(req, res, next){
	next();
}

function startServer(){
	server = http.createServer(app);
	io = io.listen(server);

	server.listen(app.get('port'), function(){
		console.log("Express server started.");
	});

	// get the namespaces going
	altitude = io.of('/altitude');
	speed = io.of('/speed');
	flying = io.of('/flying');
	heading = io.of('/heading');
	throttle_vertical = io.of('/throttle_vertical');
	throttle_horizontal = io.of('/throttle_horizontal');
	battery = io.of('/battery');

}