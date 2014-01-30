var Nodoovent = require ( "../nodoovent" );

var NodooventTests = require ( "./nodoovent.test" );
var PrivaciesTests = require ( "./privacies.test" );
var StatusTests = require ( "./status.test" );
// var user = require ( "./user" );

var URL = "http://localhost:3000";
var NODE_ENV_OLD = process.env.NODE_ENV;
process.env.NODE_ENV = "test";

Nodoovent ( function ( err, nodoovent ) {
	var httpserver = null;

	describe ( "[Nodoovent API Unit Test]", function ( ) {

		after ( function ( ) {
			if ( httpserver ) httpserver.close ( );
			process.env.NODE_ENV = NODE_ENV_OLD;
		} );

		NodooventTests ( nodoovent, httpserver );
		PrivaciesTests ( nodoovent, URL );
		StatusTests ( nodoovent, URL );

	} );

} );