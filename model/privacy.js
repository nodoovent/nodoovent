/*
 *	Privacy
 *
 *	privacy of a todo. Public or Private.
 */

var Waterline = require ( "waterline" );
var _ = require ( "lodash" );

module.exports = function ( waterline, adapter, conf ) {

	var identity = "privacies";

	var connection = conf.db.defaultConnection;
	if ( _.has ( conf.models, identity ) )
		connection = conf.models[identity];

	var Privacy = Waterline.Collection.extend ( {
		identity: identity,
		connection: connection,
		attributes: {
			name: {
				type: "string",
				required: true,
				unique: true,
				in: conf.privacies
			},
			// associations
			todos: { collection: "todos", via: "privacy" }
		}
	} );

	waterline.loadCollection ( Privacy );

	return Privacy;
}