var Waterline = require ( "waterline" );
var _ = require ( "lodash" );

module.exports = function ( waterline, adapter, conf ) {

	var identity = "developeraccounts";

	var connection = conf.db.defaultConnection;
	if ( _.has ( conf.models, identity ) )
		connection = conf.models[identity];

	var DeveloperAccount = Waterline.Collection.extend ( {
		identity: identity,
		connection: connection,
		attributes: {
			firstName: { type: "string" },
			lastName: { type: "string" },
			organizationName: { type: "string" },
			password: {
				type: "string",
				required: true,
				minLength: 5
			},
			email: {
				type: "email",
				required: true,
				unique: true
			},
			// associations
			oauth1Clients: { collection: "oauth1clients", via: "developerAccount" }
		}
	} );

	// TODO : Add validation for firstName lastName and organizationName
	// --> firstName and lastName with value and organizationName null
	// --> firstName and lastName null and organizationName with value

	waterline.loadCollection ( DeveloperAccount );

	return DeveloperAccount;

}