/*
 *	ConsumerStrategy
 *	
 *	Used to authenticate registered third client (oauth consumer).
 *	It is employed to protect the request_token and access_token endpoint.
 */

var ConsumerStrategy = require ( "passport-http-oauth" ).ConsumerStrategy;

module.exports.name = "OAuth1 Consumer";

module.exports.init = function ( model ) {
	var self = this;

	self.model = model;

	return new ConsumerStrategy (
		/*	
		 *	consumer callback
		 *	Finds the client associated with the consumerKey 		
		 */
		function ( consumerKey, callback ) {
			var query = self.model.oauth.OAuth1Client.find ( { where: { consumerKey: consumerKey } } )
			query.success ( function ( client ) { callback ( null, client, client.consumerSecret ); } );
			query.error ( function ( err ) { callback ( err ); } );
		},
		/*
		 * token callback
		 *	Finds a request token, for get an access token
		 */
		function ( requestToken, callback ) {
			var query = self.model.oauth.OAuth1RequestToken.find ( { where: { requestToken: requestToken } } );
			query.error ( function ( err ) { callback ( err ); } );
			query.success ( function ( token ) { callback ( null, token.requestSecret, token ); } );			
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