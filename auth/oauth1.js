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
		var query = OAuth1Client.find ( { where: { id: clientid } } );
		query.success ( function ( client ) {
			if ( !client ) return callback ( null, false );
			return callback ( null, client.toJSON ( ) );
		} );
		query.error ( function ( err ) { callback ( err ); } );
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
			var requestToken = self.model.oauth.OAuth1RequestToken.build ( {
				requestToken: token,
				requestSecret: secret,
				callbackUrl: callbackUrl,
				timeout: new Date.getTime ( ) + duration
			} );
			// get the OAuth1Client
			var query = self.model.oauth.OAuth1Client.find ( { where: { id: client.id } } );
			query.success ( function ( oauthclient ) {
				// OAuht1Client to OAuth1RequestToken
				requestToken.setOAuth1Client ( oauthclient );
				// save the OAuth1RequestToken
				var query = requestToken.save ( );
				query.success ( function ( requestToken ) {
					if ( !requestToken ) return callback ( null, false );
					return callback ( null, token, secret );
				} );
				query.error ( function ( err ) { return callback ( err ); } );
			} );
			query.error ( function ( err ) { return callback ( err ); } );
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
			function ( requestToken, verifier, requestToken, callback ) {
				if ( verifier != requestToken.verifier ) return callback ( null, false );
				return callback ( null, true );
			},
			function ( client, requestToken, info, callback ) {
				if ( !info.approved ) return callback ( null, false );
				if ( client.id !== info.client ) return callback ( null, false );

				var token = utils.uid ( 16 );
				var secret = utils.uid ( 64 );

				// build OAuth1AccessToken
				var accessToken = self.model.oauth.OAuth1AccessToken.build ( { 
					accessToken: token,
					accessSecret: secret
				} );
				// get OAuth1Client
				var query = self.model.oauth.OAuth1Client.find ( { where: { id: cliend.id } } );
				query.error ( function ( err ) { callback ( err ); } );
				query.success ( function ( oauthclient ) {
					accessToken.setOAuth1Client ( oauthclient );
					//get User
					var query = self.model.User.find ( { where: { id: info.user } } );
					query.error ( function ( err ) { callback ( err ); } );
					query.success ( function ( user ) {
						accessToken.setUser ( user );
						// save instance
						var query = accessToken.save ( );
						query.error ( function ( err ) { callback ( err ); } );
						query.succes ( function ( access ) {
							callback ( null, token, secret );
						} );
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
			query.success ( function ( rqstTkn ) {
				var client = rqstTkn.getOAuth1Client ( );
				return callback ( null, client.toJSON ( ), rqstTkn.callbackUrl );
			} );
		} ),
		function ( req, res ) {
			// render valide authorization permission view
		}
	];

	/*
	 *	User decision endpoint
	 *	`userDecision` middleware processes a user's decision to allow or deny access requested by a client
	 *	application.  It accepts an `issue` callback which is responsible for issuing a verifier, which is
	 *	used to verify the subsequent request by the client to exchange the request token for an access token.
	 */
	module.exports.userDecision = [
		login.ensureLoggedIn ( ), // redirect to connect view (I think :D)
		self.oauth1server.userDecision ( function ( requestToken, user, res, callback ) {
			var query = self.model.oauth.OAuth1RequestToken.find ( { where: { requestToken: requestToken } } );
			query.error ( function ( err ) { callback ( err ); } );
			query.success ( function ( rqstTkn ) {
				rqstTkn.verifier = utils.uid ( 8 );
				rqstTkn.approved = true;
				var query = self.model.User.find ( { where: { id: user.id } } );
				query.error ( function ( err ) { callback ( err ); } );
				query.success ( function ( usr ) {
					rqstTkn.setUser ( usr );
					var query = rqstTkn.save ( );
					query.error ( function ( err ) { callback ( err ); } );
					query.success ( function ( reqToken ) { callback ( null, reqToken.verifier ); } );
				} );
			} );
		} )
	];

}