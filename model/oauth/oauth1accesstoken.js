var Waterline = require ( "waterline" );

module.exports = function ( waterline, adapter ) {

	var OAuth1AccessToken = Waterline.Collection.extend ( {
		adapter: adapter.name,
		tableName: "oauth1accesstokens", // not use maj for table name - waterline bug
		attributes: {
			token: {
				type: "string",
				required: true
			},
			secret: {
				type: "string",
				required: true
			},
			// associations
			clientpermissions: { collection: "clientpermissions" },
			oauth1client: { model: "oauth1clients" },
			user: { model: "users" }
		}
	} );

	waterline.loadCollection ( OAuth1AccessToken );

	return OAuth1AccessToken;

}