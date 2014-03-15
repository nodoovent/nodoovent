module.exports = function ( models, auth ) {
	var self = this;

	var Status = models.status;

	self.list = function ( req, res ) {
		Status.find ( ).exec ( function ( err, status ) {
			if ( err ) return res.status ( 500 ).send ( { message: "error", error: err } );
			res.send ( status );
		} );
	}

	self.getbyId = function ( req, res ) {
		Status.findOne ( req.param ( "id" ) ).exec (  function ( err, status ) {
			if ( err ) return res.send ( { message: "error", error: err } );
			if ( !status ) res.status ( 404 ).send ( );
			res.send ( status );
		} );
	}
	
}