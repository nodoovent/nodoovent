/*
 *	Todo
 *
 *	An action to do ....
 */
 
var Waterline = require ( "waterline" );
var _ = require ( "lodash" );

module.exports = function ( waterline, adapter, conf ) {

	var identity = "todos";

	var connection = conf.db.defaultConnection;
	if ( _.has ( conf.models, identity ) )
		connection = conf.models[identity];

	var Todo = Waterline.Collection.extend ( {
		identity: identity,
		connection: connection,
		attributes: {
			name: {
				type: "string",
				required: true,
			},
			description: { type: "string" },
			dueAt: { type: "date" },
			// associations
			author: { model: "users" },
			status: { model: "status" },
			privacy: { model: "privacies" }
		}
	} );

	waterline.loadCollection ( Todo );

	return Todo;
}