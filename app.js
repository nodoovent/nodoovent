var http = require ( "http" );
var Nodoovent = require ( "./nodoovent" );

var nodoovent = new Nodoovent ( function ( ) {

	var app = nodoovent.app;

	http.createServer ( app ).listen ( app.get ( "port" ), function ( ) {
	  console.log ( "Nodoovent API run on port " + app.get ( "port" ) + " with " + app.get ( "env" ) + " mode" );
	} );

} );