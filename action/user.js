var login = require ( "connect-ensure-login" );


module.exports = function ( model, auth ) {
	var self = this;

	self.get = [
		login.ensureLoggedIn ( ),
		function ( req, res ) {
			res.send ( req.user );
		}
	];

}