var http = require ( "http" );
var Nodoovent = require ( "./nodoovent" );

Nodoovent ( function ( errors, nodoovent ) {
	if ( errors ) return console.error ( errors );
	var app = nodoovent.app;

	http.createServer ( app ).listen ( app.get ( "port" ), function ( ) {
	  console.log ( "Nodoovent API run on port " + app.get ( "port" ) + " with " + app.get ( "env" ) + " mode" );
	} );

} );