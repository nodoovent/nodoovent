/*
 *	TokenStrategy
 *
 *	It use to authenticate user from an access token.
 *	The user must have previously authorized a client application, which is issued an
 * 	access token to make requests on behalf of the authorizing user.
 */

var TokenStrategy = require ( "passport-http-oauth" ).TokenStrategy;

module.exports.name = "OAuth1 Token";

module.exports.init = function ( models ) {

	var OAuth1Clients = models.oauth1clients;
	var OAuth1AccessTokens = models.oauth1accesstokens;
	var Users = models.users;

	return new TokenStrategy (
		/*
		 *	Consumer callback
		 *	Finds the client associated with the consumerKey 		
		 */
		function ( consumerKey, callback ) {
			OAuth1Clients.findOne ( ).where ( { consumerKey: consumerKey } ).exec ( function ( err, client ) {
				if ( err ) return callback ( err );
				if ( !client ) return callback ( null, false );
				callback ( null, client, client.consumerKey );
			} );
		},
		/*
		 *	Verify callback
		 *	Verify the access token
		 */
		function ( accessToken, callback ) {
			OAuth1AccessTokens.findOne ( ).where ( { token: accessToken } ).exec ( function ( err, token ) {
				if ( err ) return callback ( err );
				if ( !token ) return callback ( null, false );
				Users.findOne ( token.user ).exec ( function ( err, user ) {
					if ( err ) return callback ( err );
					if ( !user ) return callback ( "No User found" );
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