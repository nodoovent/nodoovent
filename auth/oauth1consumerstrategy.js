/*
 *	ConsumerStrategy
 *	
 *	Used to authenticate registered third client (oauth consumer).
 *	It is employed to protect the request_token and access_token endpoint.
 */

var PassportHttpOAuth = require ( "passport-http-oauth" );
var ConsumerStrategy = PassportHttpOAuth.ConsumerStrategy;

module.exports.name = "OAuth1 Consumer";

module.exports.init = function ( models ) {

	var OAuth1Clients = models.oauth1clients;
	var OAuth1RequestTokens = models.oauth1requesttokens;

	return new ConsumerStrategy (
		/*	
		 *	consumer callback
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
		 * token callback
		 *	Finds a request token, for get an access token
		 */
		function ( requestToken, callback ) {
			OAuth1RequestTokens.findOne ( ).where ( { token: requestToken } ).exec ( function ( err, token ) {
				if ( err ) return callback ( err );
				if ( !token ) return callback ( null, false );
				callback ( null, token.secret, token );
			} );
		},
		/*
		 *	validate callback
		 *	The application can check timestamps and nonces, as a precaution against replay attack
		 */
		function ( timestamp, nonce, callback ) {
			callback ( null, true ); // no validate for moment
		}
	)
}