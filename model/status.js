/*
 *	Status
 *
 *	the current status of a todo (for example: "In progress").
 */

var Waterline = require ( "waterline" );
var _ = require ( "lodash" );

module.exports = function ( waterline, adapter, conf ) {

	var identity = "status";

	var connection = conf.db.defaultConnection;
	if ( _.has ( conf.models, identity ) )
		connection = conf.models[identity];

	var Status = Waterline.Collection.extend ( {
		identity: identity,
		connection: connection,
		adapter: adapter.name,
		tableName: "status", // not use maj for table name - waterline bug
		attributes: {
			name: {
				type: "string",
				required: true,
				unique: true,
				in: conf.status
			},
			// associations
			todos: { collections: "todos", via: "status" },

			// instance methods
			toJSON: function ( ) {
				return { id: this.id, name: this.name };
			}
			
		}
	} );

	waterline.loadCollection ( Status );

	return Status;
} 