/*
 *	Status
 *
 *	the current status of a todo (for example: "In progress").
 */

module.exports = function ( schema, conf ) {

	var Status = schema.define ( 
		"Status",
		{
			status: { type: String, index: true }
		}
	);

	Status.validatesPresenceOf ( "status" );
	Status.validatesInclusionOf ( "status", { in: conf.status } );
	Status.validatesUniquenessOf ( "status", { message: "status is not unique" } );

	Status.prototype.toJSON = function ( ) {
		if ( typeof this.id == "string" ) this.id = parseInt ( this.id, 10 );
		return {
			id: this.id,
			status: this.status
		};
	}

	return Status;
} 