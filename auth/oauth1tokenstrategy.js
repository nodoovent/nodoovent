/*
 *	TokenStrategy
 *
 *	It use to authenticate user from an access token.
 *	The user must have previously authorized a client application, which is issued an
 * 	access token to make requests on behalf of the authorizing user.
 */

var TokenStrategy = require ( "passport-http-oauth" ).TokenStrategy;

module.exports.name = "OAuth1 Token";

module.exports.init = function ( model ) {
	
	var OAuth1Client = model.oauth.OAuth1Client;
	var OAuth1AccessToken = model.oauth.OAuth1AccessToken;
	var User = model.User;

	return new TokenStrategy (
		/*
		 *	Consumer callback
		 *	Finds the client associated with the consumerKey 		
		 */
		function ( consumerKey, callback ) {
			var req = OAuth1Client.find ( { where: { consumerKey: consumerKey } } )
			req.success ( function ( client ) {
				if ( !client ) return callback ( null, false );
				callback ( null, client.toJSON ( ), client.consumerSecret );
			} );
			req.error ( function ( err ) {
				callback ( err );
			} );
		},
		/*
		 *	Verify callback
		 *	Verify the access token
		 */
		function ( accessToken, callback ) {
			var req = OAuth1AccessToken.find ( { where: { accessToken: accessToken } } );
			req.success ( function ( access ) {
				if ( !access ) return callback ( null, false );
				var req = access.getUser ( );
				req.success ( function ( user ) {
					if ( !user ) return callback ( null, false );
					var info = { scope: "*" }; // no scope to keep it simple (for scope look about permission)
					callback ( null, user.toJSON ( ), access.accessScret, info );
				} );
				req.error ( function ( err ) {
					callback ( err );
				} );
			} );
			req.error ( function ( err ) {
				callback ( err );
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