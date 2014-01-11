module.exports = function ( schema, auth ) {
	var self = this;

	self.schema = schema;
	self.auth = auth;

	var Privacy = schema.models.Privacy;

	self.list = function ( req, res ) {
		Privacy.all ( function ( err, privacies ) {
			if ( err ) return res.send ( { message: "error", error: err } );
			res.send ( privacies );
		} );
	}

	self.getbyId = function ( req, res ) {
		Privacy.find ( req.param ( "id" ), function ( err, privacy ) {
			if ( err ) return res.send ( { message: "error", error: err } );
			if ( !privacy ) res.status ( 404 ).send ( );
			res.send ( privacy );
		} );
	}
	
}