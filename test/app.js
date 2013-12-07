var should = require ( "should" );
var http = require ( "http" );

var Nodoovent = require ( "../nodoovent" );

var privacy = require ( "./privacy" );
var status = require ( "./status" );
var user = require ( "./user" );

var URL = "http://localhost:3000";


var addDevAccountAndClient = function ( nodoovent, callback ) {
	var dev = { firstName: "Maxime", lastName: "Journaux", email: "journaux.maxime@gmail.com", password: "max" };
	nodoovent.schema.models.DeveloperAccount.create ( dev, function ( err, dev ) {
		if ( err ) return callback ( err );
		var client = { name: "Zeitungen", description: "Dev client for Zeitungen", consumerKey: "zeitungen", consumerSecret: "secret", developerAccount: dev.id }
		nodoovent.schema.models.OAuth1Client.create ( client, function ( err, client ) {
			if ( err ) return callback ( err );
			callback ( );
		} );
	} );
};

describe ( "[Nodoovent API Unit Test]", function ( ) {

	var nodoovent = null;
	var httpserver = null;
	var NODE_ENV_OLD = process.env.NODE_ENV;

	var _privacy = new privacy ( URL );
	var _status = new status ( URL );
	var _user = new user ( URL );

	before ( function ( callback ) {
		process.env.NODE_ENV = "test";
		nodoovent = new Nodoovent ( function ( err ) {
			if ( err ) return callback ( err );
			_user.nodoovent = nodoovent;
			addDevAccountAndClient ( nodoovent, callback );
		} );
	} );

	after ( function ( ) {
		if ( httpserver ) httpserver.close ( );
		process.env.NODE_ENV = NODE_ENV_OLD;
	} );

	describe ( "Start test Nodoovent API server:", function ( ) {

		it ( "should get Nodoovent instance", function ( ) {
			nodoovent.should.have.property ( "app" );
			nodoovent.should.have.property ( "conf" );
			nodoovent.should.have.property ( "schema" );
			nodoovent.should.have.property ( "auth" );
			nodoovent.should.have.property ( "actions" );
			nodoovent.should.have.property ( "routes" );
		} );

		it ( "should start server", function ( callback ) {
			var app = nodoovent.app;
			httpserver = http.createServer ( app ).listen ( app.get ( "port" ), function ( err ) {
	  			if ( err ) return callback ( err );
	  			callback ( );
			} );
		} );

	} );

	_privacy.test ( );
	_status.test ( );
	_user.test ( );
	
} );