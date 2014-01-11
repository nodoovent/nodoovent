/*
 *	Privacy
 *
 *	privacy of a todo. Public or Private.
 */
module.exports = function ( schema, conf ) {

	var Privacy = schema.define ( 
		"Privacy",
		{
			name: { type: String, index: true }
		}
	);

	Privacy.validatesPresenceOf ( "name" );
	Privacy.validatesInclusionOf ( "name", { in: conf.privacies } );
	Privacy.validatesUniquenessOf ( "name", { message: "name is not unique" } );

	Privacy.prototype.toJSON = function ( ) {
		if ( typeof this.id == "string" ) this.id = parseInt ( this.id, 10 );
		return {
			id: this.id,
			name: this.name
		};
	}

	return Privacy;
}