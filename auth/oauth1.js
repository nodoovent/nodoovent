var oauthorize = require ( "oauthorize" );
var passport = require ( "passport" );
var login = require ( "connect-ensure-login" );

var utils = require ( "../utils" );
var OAuth1ConsumerStrategy = require ( "./oauth1consumerstrategy" );


module.exports = function ( model ) {
	var self = this;

	self.model = model;
	self.oauth1server = oauthorize.createServer ( );

	/*
	 *	Register serialialization and deserialization functions
	 *	How a client is serialize into the http session by oauthorize
	 */
	self.oauth1server.serializeClient ( function ( client, callback ) {
		return callback ( null, client.id );
	} );

	self.oauth1server.deserializeClient ( function ( clientid, callback ) {
		var query = self.model.oauth.OAuth1Client.find ( { where: { id: clientid } } );
		query.error ( function ( err ) { callback ( err ); } );
		query.success ( function ( client ) { callback ( null, client ) } );
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
			var query = self.model.oauth.OAuth1RequestToken.create ( {
				requestToken: token,
				requestSecret: secret,
				callbackUrl: callbackURL,
				timeout: new Date ( ).getTime ( ) + duration
			} );
			query.error ( function ( err ) { console.log ( err ); return callback ( err ); } );
			query.success ( function ( requestToken ) {
				// add requestToken to client
				var query = client.addOAuth1RequestToken ( requestToken );
				query.error ( function ( err ) { return callback ( err ); } );
				query.success ( function ( requestToken ) { callback ( null, token, secret ); } );
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
				if ( client.id !== token.OAuth1ClientId ) return callback ( null, false );

				var accesstoken = utils.uid ( 16 );
				var accesssecret = utils.uid ( 64 );

				// create AccessToken
				var query = self.model.oauth.OAuth1AccessToken.create ( { accessToken: accesstoken, accessSecret: accesssecret } );
				query.error ( function ( err ) { callback ( err ); } );
				query.success ( function ( access ) {
					// add access token to client
					client.addOAuth1AccessToken ( access ).error ( function ( err ) { callback ( err ); } );

					// find client
					var query = self.model.User.find ( { where: { id: token.UserId } } );
					query.error ( function ( err ) { callback ( err ); } );
					query.success ( function ( user ) {
						// add access token to user
						var query = user.addOAuth1AccessToken ( access );
						query.error ( function ( err ) { callback ( err ); } );
						query.success ( function ( access ) { callback ( null, access.accessToken, access.accessSecret ) } );
					} );
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
			var query = self.model.oauth.OAuth1RequestToken.find ( { where: { requestToken: requestToken } } );
			query.error ( function ( err ) { callback ( err ); } );
			query.success ( function ( token ) {
				var query = self.model.oauth.OAuth1Client.find ( { where: { id: token.OAuth1ClientId } } );
				query.error ( function ( err ) { callback ( err ); } );
				query.success ( function ( client ) { callback ( null, client, token.callbackUrl ) } );
			} );
		} ),
		function ( req, res ) { res.send ( "ohoh !! There are some error here !!" ) }
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
			var query = self.model.oauth.OAuth1RequestToken.find ( { where: { requestToken: requestToken } } );
			query.error ( function ( err ) { callback ( err ); } );
			query.success ( function ( requestToken ) {
				// update values
				requestToken.verifier = utils.uid ( 8 );
				requestToken.approved = true;

				// get User
				var query = self.model.User.find ( { where: { id: user.id } } );
				query.error ( function ( err ) { callback ( err ); } );
				query.success ( function ( user ) {
					// add requestToken to user
					var query = user.addOAuth1RequestToken ( requestToken );
					query.error ( function ( err ) { callback ( err ); } );
					query.success ( function ( requestToken ) { callback ( null, requestToken.verifier ) } );
				} );
			} );
		} )
	];
}