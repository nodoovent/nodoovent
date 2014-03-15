var Waterline = require ( "waterline" );
var _ = require ( "lodash" );

module.exports = function ( waterline, adapter, conf ) {

	var identity = "oauth1clients";

	var connection = conf.db.defaultConnection;
	if ( _.has ( conf.models, identity ) )
		connection = conf.models[identity];

	var OAuth1Client = Waterline.Collection.extend ( {
		identity: identity,
		connection: connection,
		attributes: {
			name: {
				type: "string",
				required: true
			},
			description: { type: "text" },
			consumerKey: {
				type: "string",
				required: true
			},
			consumerSecret: {
				type: "string",
				required: true
			},
			// associations
			oauth1RequestTokens: { collection: "oauth1requesttokens", via: "oauth1Client" },
			oauth1AccessTokens: { collection: "oauth1accesstokens", via: "oauth1Client" },
			developerAccount: { model: "developeraccounts" }
		}
	} );

	waterline.loadCollection ( OAuth1Client );

	return OAuth1Client;

}