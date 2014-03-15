var NodooventTests = require ( "./nodoovent.test" );
var PrivaciesTests = require ( "./privacies.test" );
var StatusTests = require ( "./status.test" );
var UsersTests = require ( "./users.test" );
var TodosTests = require ( "./todos.test" );

var URL = "http://localhost:3000";

var NODE_ENV_OLD = global.NODE_ENV_OLD;
var nodoovent = global.nodoovent;

var httpserver = null;

describe ( "[Nodoovent API Unit Test]", function ( ) {

	after ( function ( ) {
		if ( httpserver ) httpserver.close ( );
		process.env.NODE_ENV = NODE_ENV_OLD;
	} );

	NodooventTests ( nodoovent, httpserver );
	PrivaciesTests ( nodoovent, URL );
	StatusTests ( nodoovent, URL );
	UsersTests ( nodoovent, URL );
	TodosTests ( nodoovent, URL );

} );