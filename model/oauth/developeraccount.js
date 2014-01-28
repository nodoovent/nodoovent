var Waterline = require ( "waterline" );

module.exports = function ( waterline, adapter ) {

	var DeveloperAccount = Waterline.Collection.extend ( {
		adapter: adapter.name,
		tableName: "developeraccounts", // not use maj for table name - waterline bug
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
			oauth1clients: { collection: "oauth1clients" }
		}
	} );

	// TODO : Add validation for firstName lastName and organizationName
	// --> firstName and lastName with value and organizationName null
	// --> firstName and lastName null and organizationName with value

	waterline.loadCollection ( DeveloperAccount );

	return DeveloperAccount;

}