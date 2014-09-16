/**
 * Module dependencies.
 */

var path = require ( "path" );

var express = require ( "express" );
var bodyParser = require ( "body-parser" );
var favicon = require ( "serve-favicon" );
var methodOverride = require ( "method-override" );
var session = require ( "express-session" );
var cookieParser = require ( "cookie-parser" );
var passport = require ( "passport" );

var conf = require ( "./conf" );
var utils = require ( "./utils" );
var routes = require ( "./routes" );
var models = require ( "./model" );
var auth = require ( "./auth" );
var actions = require ( "./action" );

var routebuilder = utils.RouteBuilder;

module.exports = function ( callback ) {
	var nodoovent = { };

	nodoovent.app = express ( );
	var app = nodoovent.app;

	// all environments
	app.set ( "port", process.env.PORT || 3000 );
	app.set ( "views", __dirname + "/views" );
	app.set ( "view engine", "ejs" );
	app.use ( favicon ( path.join ( __dirname, "public", "favicon.png" ) ) );
	app.use ( bodyParser.json ( ) );

	// load specific module for specific environement
	var errorhandler = null;
	var morgan = null;
	if  ( "development" === app.get ( "env" ) ) {
		errorhandler = require ( "errorhandler" );
		morgan = require ( "morgan" );
	}
	if ( "test" === app.get ( "env" ) ) {
		errorhandler = require ( "errorhandler" );
	}

	// development only
	if  ( "development" === app.get ( "env" ) ) {
		app.use ( morgan ( "dev" ) );
	}

	app.use ( methodOverride ( ) );
	app.use ( cookieParser ( "your secret here" ) );
	app.use ( session ( { secret: "nodoovent ninja dev", resave: true, saveUninitialized: true } ) );
	app.use ( passport.initialize ( ) );
	app.use ( passport.session ( ) );
	app.use ( express.static ( path.join ( __dirname, "public" ) ) );

	// development only
	if  ( "development" === app.get ( "env" ) ) {
		app.use ( errorhandler ( ) );
	}

	// test only
	if ( "test" === app.get ( "env" ) ) {
		app.use ( errorhandler ( ) );
	}

	// load conf
	nodoovent.conf = conf ( app.get ( "env" ) );

	// init model
	models.init ( nodoovent.conf, function ( err, models, connections ) {
		if ( err ) return callback ( err );
		nodoovent.models = models;
		nodoovent.connections = connections;

		nodoovent.auth = new auth ( nodoovent.models );
		nodoovent.actions = new actions ( nodoovent.models, nodoovent.auth );
		nodoovent.routes = new routes ( nodoovent.models, nodoovent.auth, nodoovent.actions );

		routebuilder ( nodoovent );

		callback ( null, nodoovent );
	} );
};