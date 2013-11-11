var passport = require ( "passport" );


module.exports = function ( model, auth ) {
	var self = this;

	self.model = model;
	self.auth = auth;

	self.list = function ( req, res ) {
		var query = self.model.Tag.findAll ( );
		query.success ( function ( tags ) { res.send ( tags ); } );
	}

}