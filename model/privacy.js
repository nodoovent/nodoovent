/*
 *	Privacy
 *
 *	privacy of a todo. Public or Private.
 */

var Waterline = require ( "waterline" );

module.exports = function ( waterline, adapter, conf ) {

	var Privacy = Waterline.Collection.extend ( {
		adapter: adapter.name,
		tableName: "privacies", // not use maj for table name - waterline bug
		attributes: {
			name: {
				type: "string",
				required: true,
				unique: true,
				in: conf.privacies
			}
		}
	} );

	waterline.loadCollection ( Privacy );

	return Privacy;
}