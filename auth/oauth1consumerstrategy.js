/*
 *	ConsumerStrategy
 *	
 *	Used to authenticate registered third client (oauth consumer).
 *	It is employed to protect the request_token and access_token endpoint.
 */

var ConsumerStrategy = require ( "passport-http-oauth" ).ConsumerStrategy;

module.exports.name = "OAuth1 Consumer";

module.exports.init = function ( model ) {
	
	var OAuth1Client = model.oauth.OAuth1Client;
	var OAuth1RequestToken = model.oauth.OAuth1RequestToken;

	return new ConsumerStrategy (
		/*	
		 *	consumer callback
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
		 * token callback
		 *	Finds a request token, for get an access token
		 */
		function ( requestToken, callback ) {
			var req = OAuth1RequestToken.find ( { where: { requestToken: requestToken } } );
			req.success ( function ( request ) {
				if ( !request ) return callback ( null, false );
				request ( null, request.requestSecret, request.toJSON ( ) );
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