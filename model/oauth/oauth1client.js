var Waterline = require ( "waterline" );

module.exports = function ( waterline, adapter ) {
	
	var OAuth1Client = Waterline.Collection.extend ( {
		adapter: adapter.name,
		tableName: "oauth1clients", // not use maj for table name - waterline bug
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
			oauth1RequestTokens: { collection: "oauth1requesttokens" },
			oauth1AccessTokens: { collection: "oauth1accesstokens" },
			developerAccount: { model: "developeraccounts" }
		}
	} );

	waterline.loadCollection ( OAuth1Client );

	return OAuth1Client;

}