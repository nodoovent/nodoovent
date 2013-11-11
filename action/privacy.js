module.exports = function ( model, auth ) {
	var self = this;

	self.model = model;
	self.auth = auth;

	self.list = function ( req, res ) {
		var query = self.model.Privacy.all ( );
		query.success ( function ( privacies ) { res.send ( privacies ); } );
	}

	self.getbyId = function ( req, res ) {
		var query = self.model.Privacy.find ( req.param ( "id" ) );
		query.success ( function ( privacy ) { 
			if ( privacy ) res.send ( privacy );
			else res.status ( 404 ).send ( );
		} );
	}
	
}