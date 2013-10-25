module.exports = function ( model, auth ) {
	var self = this;

	self.model = model;
	self.auth = auth;

	self.list = function ( req, res ) {
		var query = self.model.Status.all ( );
		query.success ( function ( status ) { res.send ( status ); } );
	}

	self.getbyId = function ( req, res ) {
		var query = self.model.Status.find ( req.param ( 0 ) );
		query.success ( function ( status ) { res.send ( status ) } );
	}
	
}