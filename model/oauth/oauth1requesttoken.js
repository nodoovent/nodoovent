var Waterline = require ( "waterline" );

module.exports = function ( waterline, adapter ) {
	
	var OAuth1RequestToken = Waterline.Collection.extend ( {
		adapter: adapter.name,
		tableName: "oauth1requesttokens", // not use maj for table name - waterline bug
		attributes: {
			token: {
				type: "string",
				required: true
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