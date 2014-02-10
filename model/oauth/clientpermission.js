var Waterline = require ( "waterline" );
var _ = require ( "lodash" );

module.exports = function ( waterline, adapter, conf ) {

	var identity = "clientpermissions";

	var connection = conf.db.defaultConnection;
	if ( _.has ( conf.models, identity ) )
		connection = conf.models[identity];

	var ClientPermission = Waterline.Collection.extend ( {
		identity: identity,
		connection: connection,
		attributes: {
			name: {
				type: "string",
				required: true
			},
			unlock: {
				type: "string",	// good format ???
				required: true
			},
			// associations
			// oauth1AccessTokens: { collection: "oauth1accesstokens", via: "clientPermissions" }
		}
	} );

	waterline.loadCollection ( ClientPermission );

	return ClientPermission;

}