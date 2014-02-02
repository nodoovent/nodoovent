var Nodoovent = require ( "../nodoovent" );

var NodooventTests = require ( "./nodoovent.test" );
var PrivaciesTests = require ( "./privacies.test" );
var StatusTests = require ( "./status.test" );
var UsersTests = require ( "./users.test" );

var URL = "http://localhost:3000";
var NODE_ENV_OLD = process.env.NODE_ENV;
process.env.NODE_ENV = "test";

Nodoovent ( function ( err, nodoovent ) {
	var httpserver = null;

	createDeveloperAccountAndOAuth1Client ( nodoovent, function ( err ) {

		describe ( "[Nodoovent API Unit Test]", function ( ) {

			after ( function ( ) {
				if ( httpserver ) httpserver.close ( );
				process.env.NODE_ENV = NODE_ENV_OLD;
			} );

			NodooventTests ( nodoovent, httpserver );
			PrivaciesTests ( nodoovent, URL );
			StatusTests ( nodoovent, URL );
			UsersTests ( nodoovent, URL );

		} );

	} );

} );

function createDeveloperAccountAndOAuth1Client ( nodoovent, callback ) {
	var models = nodoovent.models;
	var account = { organizationName: "Nodoovent", password: "nodoovent", email: "nodoovent@nodoovent.com" };
	var client = { name: "Nodoovent", description: "Nodoovent official client", consumerKey: "nodoovent", consumerSecret: "nodoovent" };
	models.developeraccounts.create ( account, function ( err, account ) {
		if ( err ) return callback ( err );
		client.developeraccount = account.id;
		models.oauth1clients.create ( client, function ( err, client ) {
			if ( err ) return callback ( err );
			callback ( null );
		} );
	} );
}