var oauthorize = require ( "oauthorize" );
var passport = require ( "passport" );
var login = require ( "connect-ensure-login" );

var utils = require ( "../utils" );
var OAuth1ConsumerStrategy = require ( "./oauth1consumerstrategy" );


module.exports = function ( schema ) {
	var self = this;

	self.schema = schema;
	self.oauth1server = oauthorize.createServer ( );

	var OAuth1Client = schema.models.OAuth1Client;
	var OAuth1RequestToken = schema.models.OAuth1RequestToken;
	var OAuth1AccessToken = schema.models.OAuth1AccessToken;

	/*
	 *	Register serialialization and deserialization functions
	 *	How a client is serialize into the http session by oauthorize
	 */
	self.oauth1server.serializeClient ( function ( client, callback ) {
		return callback ( null, client.id );
	} );

	self.oauth1server.deserializeClient ( function ( clientid, callback ) {
		OAuth1Client.find ( clientid, function ( err, client ) {
			if ( err ) return callback ( err );
			if ( !client ) return callback ( "No OAuth1Client found" );
			callback ( null, client );
		} );
	} );

	/*
	 *	Request token endpoint
	 *	`requestToken` middleware accepts an `issue` callback which is responsible for issuing a request 
	 *	token and corresponding secret.  This token serves as a temporary credential, and is used when
	 *	requesting authorization from the user. The request token is bound to the client to which it is issued.
	 *	The token should have a limited lifetime.
	 */
	self.requestToken = [
		passport.authenticate ( OAuth1ConsumerStrategy.name, { session: false } ),
		self.oauth1server.requestToken ( function ( client, callbackURL, callback ) {
			var duration = 15 * 60 * 60 * 1000;	
			var token = utils.uid ( 8 );		
			var secret = utils.uid ( 32 );		

			// build OAuth1RequestToken
			var requesttoken = { token: token, secret: secret, callbackUrl: callbackUrl, timeout: new Date ( ).getTime ( ) + duration, client: client.id };
			OAuth1RequestToken.create ( requesttoken, function ( err, requesttoken ) {
				if ( err ) return callback ( err );
				callback ( null, token, secret );
			} );
		} ),
		self.oauth1server.errorHandler ( )
	];

	/*
	 *	Access token endpoint
	 *	The `verify` callback is responsible for determining whether or not the `verifier` is valid for the 
	 *	given `requestToken`. The `issue` callback is responsible for exhanging `requestToken` for an access
	 *	token and corresponding secret, which will be issued to the client.
	 */
	self.accessToken = [
		passport.authenticate ( OAuth1ConsumerStrategy.name, { session: false } ),
		self.oauth1server.accessToken (
			function ( requestToken, verifier, token, callback ) {
				if ( verifier != requestToken.verifier && requestToken != token.requestToken ) callback ( null, false );
				callback ( null, true );
			},
			function ( client, requestToken, token, callback ) {
				if ( !token.approved ) return callback ( null, false );
				if ( client.id !== token.client ) return callback ( null, false );

				var accesstoken = utils.uid ( 16 );
				var accesssecret = utils.uid ( 64 );

				// create access token
				var access = { token: accesstoken, secret: accesssecret, client: client.id, user: token.user };
				OAuth1AccessToken.create ( access, function ( err, access ) {
					if ( err ) return callback ( err );
					callback ( null, accesstoken, accesssecret );
				} );
			}
		),
		self.oauth1server.errorHandler ( )
	];



	/*
	 *	User authorization endpoints
	 *	`userAuthorization` middleware accepts a `validate` callback which is responsible for retrieving
	 *	details about a previously issued request token. Once retreived, the `done` callback must be invoked
	 *	with the client to which the request token was issued, as well as the callback URL to which the user
	 *	will be redirected after an authorization decision is obtained.
	 */
	self.userAuthorization = [
		login.ensureLoggedIn ( ), // redirect to connect view
		self.oauth1server.userAuthorization ( function ( requestToken, callback ) {
			OAuth1RequestToken.all ( { where: { token: requestToken } }, function ( err, tokens ) {
				if ( err ) return callback ( err );
				if ( tokens.length == 0 ) return callback ( "No OAuth1RequestToken found with token=" + requestToken );
				if ( tokens.length > 0 ) return callback ( "Many OAuth1RequestToken with the same token are found, it's weird !" );
				var token = tokens[0];
				OAuth1Client.find ( token.client, function ( err, client ) {
					if ( err ) return callback ( err );
					if ( !client ) return callback ( "No OAuth1client found with id=" + token.client );
					callback ( null, client, token.callbackUrl );
				} );
			} );
		} ),
		function ( req, res ) { res.send ( "Ohoh !! There are some error here !!" ) }
	];

	/*
	 *	User decision endpoint
	 *	`userDecision` middleware processes a user's decision to allow or deny access requested by a client
	 *	application.  It accepts an `issue` callback which is responsible for issuing a verifier, which is
	 *	used to verify the subsequent request by the client to exchange the request token for an access token.
	 */
	self.userDecision = [
		login.ensureLoggedIn ( ), // redirect to connect view (I think :D)
		self.oauth1server.userDecision ( function ( requestToken, user, res, callback ) {
			// get requestToken
			OAuth1RequestToken.all ( { where: { requestToken: requestToken } }, function ( err, tokens ) {
				if ( err ) return callback ( err );
				if ( tokens.length == 0 ) return callback ( "No OAuth1RequestToken found with token=" + requestToken );
				if ( tokens.length > 0 ) return callback ( "Many OAuth1RequestToken with the same token are found, it's weird !" );
				var token = tokens[0];
				// update values
				token.verifier = utils.uid ( 8 );
				token.approved = true;
				token.user = user.id;
				token.save ( function ( err, token ) {
					if ( err ) return callback ( err );
					callback ( null, token.verifier );
				} );
			} );
		} )
	];
}