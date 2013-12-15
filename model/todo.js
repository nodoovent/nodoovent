/*
 *	Todo
 *
 *	An action to do ....
 */

module.exports = function ( schema ) {
	
	var Todo = schema.define ( 
		"Todo",
		{
			name: { type: String },
			description: { type: String },
			dueAt: { type: Date },
			createdAt: { type: Date, default: function ( ) { return new Date; } },
			updatedAt: { type: Date, default: function ( ) { return new Date; } }
		}
	);

	Todo.validatesPresenceOf ( "name", "createdAt", "updatedAt" );

	return Todo;

}