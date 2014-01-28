/*
 *	ConsumerStrategy
 *	
 *	Used to authenticate registered third client (oauth consumer).
 *	It is employed to protect the request_token and access_token endpoint.
 */

var ConsumerStrategy = require ( "passport-http-oauth" ).ConsumerStrategy;

module.exports.name = "OAuth1 Consumer";

module.exports.init = function ( models ) {

	var oauth1clients = models.oauth1clients;
	var oauth1requesttokens = models.oauth1requesttokens;

	return new ConsumerStrategy (
		/*	
		 *	consumer callback
		 *	Finds the client associated with the consumerKey 		
		 */
		function ( consumerKey, callback ) {
			oauth1clients.findOne ( ).where ( { consumerKey: consumerKey } ).exec ( function ( err, client ) {
				if ( err ) return callback ( err );
				if ( !client ) return callback ( "No OAuth1 Client found" );
				callback ( null, client, client.consumerKey );
			} );
		},
		/*
		 * token callback
		 *	Finds a request token, for get an access token
		 */
		function ( requestToken, callback ) {
			oauth1requesttokens.findOne ( ).where ( { token: requestToken } ).exec ( function ( err, token ) {
				if ( err ) return callback ( err );
				if ( !token ) return callback ( "No OAuth1 Request Token found" );
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