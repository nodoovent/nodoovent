var Waterline = require ( "waterline" );

module.exports = function ( waterline, adapter ) {
	
	var ClientPermission = Waterline.Collection.extend ( {
		adapter: adapter.name,
		tableName: "clientpermissions", // not use maj for table name - waterline bug
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
			oauth1accesstokens: { collection: "oauth1accesstokens" }
		}
	} );

	waterline.loadCollection ( ClientPermission );

	return ClientPermission;

}