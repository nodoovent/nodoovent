
/**
 * Module dependencies.
 */

var express = require ( "express" );
var http = require ( "http" );
var path = require ( "path" );
var passport = require ( "passport" );

var routebuilder = require ( "./routebuilder" );
var routes = require ( "./routes" );
var model = require ( "./model" );
var auth = require ( "./auth" );
var action = require ( "./action" );


var app = express ( );

// all environments
app.set ( "port", process.env.PORT || 3000 );
app.set ( "views", __dirname + "/views" );
app.set ( "view engine", "ejs" );
app.use ( express.favicon ( ) );
app.use ( express.logger ( "dev" ) );
app.use ( express.bodyParser ( ) );
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

// init model
var _model = model.init ( );

// init authentification
var _auth = new auth ( _model );


// init actions
var _action = new action ( _model, _auth );

// init routes
var _routes = new routes ( _model, _auth, _action )

// build routes
routebuilder ( app, _routes.routes );

http.createServer ( app ).listen ( app.get ( "port" ), function ( ){
  console.log ( "Express server listening on port " + app.get ( "port" ) );
} );
