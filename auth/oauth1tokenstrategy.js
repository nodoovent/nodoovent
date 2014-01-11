/*
 *	TokenStrategy
 *
 *	It use to authenticate user from an access token.
 *	The user must have previously authorized a client application, which is issued an
 * 	access token to make requests on behalf of the authorizing user.
 */

var TokenStrategy = require ( "passport-http-oauth" ).TokenStrategy;

module.exports.name = "OAuth1 Token";

module.exports.init = function ( schema ) {

	var OAuth1Client = schema.models.OAuth1Client;
	var OAuth1AccessToken = schema.models.OAuth1AccessToken;
	var User = schema.models.User;

	return new TokenStrategy (
		/*
		 *	Consumer callback
		 *	Finds the client associated with the consumerKey 		
		 */
		function ( consumerKey, callback ) {
			OAuth1Client.all ( { where: { consumerKey: consumerKey } }, function ( err, clients ) {
				if ( err ) return callback ( err );
				if ( clients.length > 1 ) return callback ( "Many OAuth1 clients with same consumer key and secret, it's weird !" );
				if ( clients.length == 0 ) return callback ( "No OAuth1 client found" );
				var client = clients[0];
				callback ( null, client, client.consumerSecret );
			} );
		},
		/*
		 *	Verify callback
		 *	Verify the access token
		 */
		function ( accessToken, callback ) {
			OAuth1AccessToken.all (  { where: { token: accessToken } }, function ( err, tokens ) {
				if ( err ) return callback ( err );
				if ( tokens.length > 1 ) return callback ( "Many OAuth1 access tokens, it's weird !" );
				if ( tokens.length == 0 ) return callback ( );
				var token = tokens[0];
				User.find ( token.user, function ( err, user ) {
					if ( err ) return callback ( err );
					if ( !user ) return callback ( "No user found" );
					var info = { scope: "*" }; // no scope to keep it simple (for scope look about permission model)
					callback ( null, user, token.secret, info );
				} );
			} );
		},
		/*
		 *	validate callback
		 *	The application can check timestamps and nonces, as a precaution against replay attack
		 */
		function ( timestamp, nonce, callback ) {
			callback ( null, true ); // no validate for moment
		}
	);

}