var should = require ( "should" );
var http = require ( "http" );

var Nodoovent = require ( "../nodoovent" );

var privacy = require ( "./privacy" );
var status = require ( "./status" );
var user = require ( "./user" );

var URL = "http://localhost:3000";


var addDevAccountAndClient = function ( nodoovent, callback ) {
	nodoovent.model.oauth.DevelopperAccount.create ( { firstName: "Maxime", lastName: "Journaux", email: "journaux.maxime@gmail.com", password: "max" } )
	.error ( function ( err ) { callback ( err ); } )
	.success ( function ( dev ) {
		nodoovent.model.oauth.OAuth1Client.create ( { name: "Zeitungen", description: "Dev client for Zeitungen", consumerKey: "zeitungen", consumerSecret: "secret" } )
		.error ( function ( err ) { callback ( err ); } )
		.success ( function ( client ) {
			dev.addOAuth1Client ( client ).success ( function ( client ) { callback ( ) } ).error ( function ( err ) { callback ( err ) } );
		} );
	} );
};

var addUserAndOAuth1AccessToken = function ( nodoovent, callback ) {
	// create a test user and add an oauth1 access token
	var sherlock = { firstName: "Sherlock", lastName: "Holmes", login: "sherlock", email: "sherlock.holmes@backerstreet.com", password: "adler" };
	var model = nodoovent.model;
	model.User.create ( sherlock )
	.error ( function ( err ) { callback ( err ); } )
	.success ( function ( user ) {
		model.oauth.OAuth1Client.find ( 1 )
		.error ( function ( err ) { callback ( err ); } )
		.success ( function ( client ) {
			accessToken = { accessToken: "kLUnEv8dDGeIIbhH", accessSecret: "0LCtCYQZSTJ0DyOzdif4GpZwGmFjAev2ocTpF38EouzvdLJKQy3x32ZwSVCPSFzi", UserId: user.id, OAuth1ClientId: client.id };
			model.oauth.OAuth1AccessToken.create ( accessToken  )
			.error ( function ( err ) { callback ( err ); } )
			.success ( function ( accessToken ) { callback ( ); } );
		} );
	} );
}


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
			addDevAccountAndClient ( nodoovent, function ( err ) {
				if ( err ) return callback ( err );
				addUserAndOAuth1AccessToken ( nodoovent, callback );
			} );
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
			nodoovent.should.have.property ( "model" );
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