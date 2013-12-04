module.exports = function ( schema, auth ) {
	var self = this;

	var Status = schema.models.Status;

	self.list = function ( req, res ) {
		Status.all ( function ( err, status ) {
			if ( err ) return res.send ( { message: "error", error: err } );
			res.send ( status );
		} );
	}

	self.getbyId = function ( req, res ) {
		Status.find ( req.param ( "id" ), function ( err, status ) {
			if ( err ) return res.send ( { message: "error", error: err } );
			if ( !status ) res.status ( 404 ).send ( );
			res.send ( status );
		} );
	}
	
}