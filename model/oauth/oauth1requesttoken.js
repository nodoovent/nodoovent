var Waterline = require ( "waterline" );
var _ = require ( "lodash" );

module.exports = function ( waterline, adapter, conf ) {

	var identity = "oauth1requesttokens";

	var connection = conf.db.defaultConnection;
	if ( _.has ( conf.models, identity ) )
		connection = conf.models[identity];

	var OAuth1RequestToken = Waterline.Collection.extend ( {
		identity: identity,
		connection: connection,
		attributes: {
			token: {
				type: "string",
				required: true,
				unique: true
			},
			secret: {
				type: "string",
				required: true
			},
			callbackUrl: {
				type: "string",
				required: true
			},
			timeout: { type: "datetime" },
			verifier: { type: "string" },
			approved: { type: "boolean" },
			// associations
			oauth1Client: { model: "oauth1clients" },
			user: { model: "users" }
		}
	} );

	waterline.loadCollection ( OAuth1RequestToken );

	return OAuth1RequestToken;

}