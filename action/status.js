module.exports = function ( models, auth ) {
	var self = this;

	var status = models.status;

	self.list = function ( req, res ) {
		status.find ( ).exec ( function ( err, status ) {
			if ( err ) return res.status ( 500 ).send ( { message: "error", error: err } );
			res.send ( status );
		} );
	}

	self.getbyId = function ( req, res ) {
		status.findOne ( req.param ( "id" ) ).exec (  function ( err, status ) {
			if ( err ) return res.send ( { message: "error", error: err } );
			if ( !status ) res.status ( 404 ).send ( );
			res.send ( status );
		} );
	}
	
}