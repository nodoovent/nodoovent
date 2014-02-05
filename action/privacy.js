module.exports = function ( models, auth ) {
	var self = this;

	self.models = models;
	self.auth = auth;

	var Privacies = models.privacies;

	self.list = function ( req, res ) {
		Privacies.find ( ).exec ( function ( err, privacies ) {
			if ( err ) return res.status ( 500 ).send ( { message: "error", error: err } );
			res.send ( privacies );
		} );
	}

	self.getbyId = function ( req, res ) {
		Privacies.findOne ( req.param ( "id" ) ).exec ( function ( err, privacy ) {
			if ( err ) return res.status ( 500 ).send ( { message: "error", error: err } );
			if ( !privacy ) res.status ( 404 ).send ( );
			res.send ( privacy );
		} );
	}
	
}