/*
 *	Status
 *
 *	the current status of a todo (for example: "In progress").
 */

var Waterline = require ( "waterline" );

module.exports = function ( waterline, adapter, conf ) {

	var Status = Waterline.Collection.extend ( {
		adapter: adapter.name,
		tableName: "status", // not use maj for table name - waterline bug
		attributes: {
			name: {
				type: "string",
				required: true,
				unique: true,
				in: conf.status
			}
		}
	} );

	waterline.loadCollection ( Status );

	return Status;
} 