var express = require('express')
	, path = require('path')
	, routes = require('./routes')
	, http = require('http')
	, server
	, io = require('socket.io')
	, altitude
	, flying
	, speed
	, header
	, takeOff
	, droneController = require('./ardrone-controller');

var app = express();

setupApp();

function setupApp(){
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

	app.post('/api/raw', addAltitude, addSpeed, addFlying, routes.raw);
	app.post('/api/takeoff', doTakeOff, routes.raw);

	app.get('*', function(req, res){
		console.log("Page not found: " + req.originalUrl);
		res.render('404');
	});
}

function doTakeOff(req, res, next) {
	droneController.takeoff();
	next();
}

function addFlying(req, res, next) {
	req.flying = flying;
	next();
}
function addAltitude(req, res, next){
	req.altitude = altitude;
	next();
}

function addSpeed(req, res, next){
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

	// Get the socket.io namespaces going
	altitude = io.of('/altitude');
	speed = io.of('/speed');
	flying = io.of('/flying');
}