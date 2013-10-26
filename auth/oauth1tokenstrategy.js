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
	var self = this;

	self.model = model;

	return new TokenStrategy (
		/*
		 *	Consumer callback
		 *	Finds the client associated with the consumerKey 		
		 */
		function ( consumerKey, callback ) {
			var query = self.model.oauth.OAuth1Client.find ( { where: { consumerKey: consumerKey } } )
			query.success ( function ( client ) { callback ( null, client, client.consumerSecret ); } );
			query.error ( function ( err ) { callback ( err ); } );
		},
		/*
		 *	Verify callback
		 *	Verify the access token
		 */
		function ( accessToken, callback ) {
			var query = self.model.oauth.OAuth1AccessToken.find ( { where: { accessToken: accessToken } } );
			query.error ( function ( err ) { callback ( err ); } );
			query.success ( function ( access ) {
				if ( access == null ) return callback ( "No AccessToken matching with " + accessToken );
				var query = self.model.User.find ( access.UserId );
				query.error ( function ( err ) { callback ( err ); } );
				query.success ( function ( user ) {
					var info = { scope: "*" }; // no scope to keep it simple (for scope look about permission)
					callback ( null, user, access.accessSecret, info );
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