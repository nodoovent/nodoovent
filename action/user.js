var passport = require ( "passport" );

var oauth1tokenstrategy = require ( "../auth/oauth1tokenstrategy" ).name;


module.exports = function ( model, auth ) {
	var self = this;

	self.get = [
		passport.authenticate( oauth1tokenstrategy, { session: false }),
		function ( req, res ) {
			res.send ( req.user );
		}
	];

}