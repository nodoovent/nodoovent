/*
 *	ConsumerStrategy
 *	
 *	Used to authenticate registered third client (oauth consumer).
 *	It is employed to protect the request_token and access_token endpoint.
 */

var ConsumerStrategy = require ( "passport-http-oauth" ).ConsumerStrategy;

module.exports.name = "OAuth1 Consumer";

module.exports.init = function ( schema ) {

	var OAuth1Client = schema.models.OAuth1Client;
	var OAuth1RequestToken = schema.models.OAuth1RequestToken;

	return new ConsumerStrategy (
		/*	
		 *	consumer callback
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
		 * token callback
		 *	Finds a request token, for get an access token
		 */
		function ( requestToken, callback ) {
			OAuth1RequestToken.all ( { where: { requestToken: requestToken } }, function ( err, tokens ) {
				if ( err ) return callback ( err );
				if ( tokens.length > 1 ) return callback ( "Many OAuth1 request tokens with the same token are found, it's weird !" );
				if ( tokens.length == 0 ) return callback ( "No OAut1 request token are found" );
				var token = tokens[0];
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