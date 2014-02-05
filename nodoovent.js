/**
 * Module dependencies.
 */

var path = require ( "path" );

var express = require ( "express" );
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
	app.use ( express.favicon ( ) );
	app.use ( express.bodyParser ( ) );
	if  ( "development" == app.get ( "env" ) ) { app.use ( express.logger ( "dev" ) ); }
	app.use ( express.methodOverride ( ) );
	app.use ( express.cookieParser ( "your secret here" ) );
	app.use ( express.session ( { secret: 'nodoovent ninja dev' } ) );
	app.use ( passport.initialize ( ) );
	app.use ( passport.session ( ) );
	app.use ( app.router );
	app.use ( express.static ( path.join ( __dirname, "public" ) ) );

	// development only
	if  ( "development" == app.get ( "env" ) ) {
		app.use ( express.errorHandler ( ) );
	}

	// test only
	if ( "test" == app.get ( "env" ) ) {
		app.use ( express.errorHandler ( ) );
	}

	// load conf
	nodoovent.conf = conf ( app.get ( "env" ) );

	// init model
	models.init ( nodoovent.conf, function ( err, models ) {
		if ( err ) return callback ( err );
		nodoovent.models = models;

		nodoovent.auth = new auth ( nodoovent.models );
		nodoovent.actions = new actions ( nodoovent.models, nodoovent.auth );
		nodoovent.routes = new routes ( nodoovent.models, nodoovent.auth, nodoovent.actions );

		routebuilder ( nodoovent.app, nodoovent.routes.routes );

		callback ( null, nodoovent );
	} );
};