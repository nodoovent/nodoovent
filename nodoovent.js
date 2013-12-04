/**
 * Module dependencies.
 */

var express = require ( "express" );
var path = require ( "path" );
var passport = require ( "passport" );

var conf = require ( "./conf" );
var routebuilder = require ( "./routebuilder" );
var routes = require ( "./routes" );
var model = require ( "./model" );
var auth = require ( "./auth" );
var action = require ( "./action" );

module.exports = function ( callback ) {

	var app = express ( );

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
	var _conf = conf ( app.get ( "env" ) );

	// init model
	var _model = model.init ( _conf, callback );

	// init authentification
	var _auth = new auth ( _model );


	// init actions
	var _action = new action ( _model, _auth );

	// init routes
	var _routes = new routes ( _model, _auth, _action )

	// build routes
	routebuilder ( app, _routes.routes );

	// require ( "./datas" ) ( _model );

	// add variables to this
	this.app = app;
	this.conf = _conf;
	this.model = _model;
	this.auth = _auth;
	this.actions = _action;
	this.routes = _routes;

};