var Waterline = require ( "waterline" );
var _ = require ( "lodash" );

module.exports = function ( waterline, adapter, conf ) {

	var identity = "oauth1accesstokens";

	var connection = conf.db.defaultConnection;
	if ( _.has ( conf.models, identity ) )
		connection = conf.models[identity];

	var OAuth1AccessToken = Waterline.Collection.extend ( {
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
			// associations
			// clientPermissions: { collection: "clientpermissions", via: "oauth1AccessTokens" }, // error with n to n associations
			oauth1Client: { model: "oauth1clients" },
			user: { model: "users" }
		}
	} );

	waterline.loadCollection ( OAuth1AccessToken );

	return OAuth1AccessToken;

}