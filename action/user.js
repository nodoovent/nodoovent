var passport = require ( "passport" );
var QueryChainer = require ( "../utils" ).QueryChainer;

var oauth1tokenstrategy = require ( "../auth/oauth1tokenstrategy" ).name;


module.exports = function ( schema, auth ) {
	var self = this;

	self.schema = schema;
	self.auth = auth;

	var User = schema.models.User;

	self.get = [
		passport.authenticate ( oauth1tokenstrategy, { session: false } ),
		function ( req, res ) {
			res.send ( req.user ); // call to req.user.toJSON ( )
		}
	];

	self.getById = [
		passport.authenticate ( oauth1tokenstrategy, { session: false } ),
		function ( req, res ) {
			User.find ( req.param ( "userid" ), function ( err, user ) {
				if ( err ) return res.send ( { result: "error", error: err } );
				if ( !user ) return res.status ( 404 ).send ( );
				res.send ( user );
			} );
		}
	];

	self.list = [
		passport.authenticate ( oauth1tokenstrategy, { session: false } ),
		function ( req, res ) {
			User.all ( function ( err, users ) {
				if ( err ) return res.send ( { result: "error", error: err } );
				res.send ( users );
			} );
		}
	];

	self.update = [
		passport.authenticate ( oauth1tokenstrategy, { session: false } ),
		function ( req, res ) {
			if ( req.param ( "firstName" ) )
				req.user.firstName = req.param ( "firstName" );
			if ( req.param ( "lastName" ) )
				req.user.lastName = req.param ( "lastName" );
			if ( req.param ( "email" ) || req.param ( "email" ) == "" )
				req.user.email = req.param ( "email" );
			if ( req.param ( "password" ) || req.param ( "password" ) == "" )
				req.user.password = req.param ( "password" );

			req.user.save ( function ( err, user ) {
				if ( err ) return res.send ( { result: "error", error: err } );
				res.send ( user );
			} );
		}
	];

	self.create = function ( req, res ) {
		var newuser = {
			firstName: req.param ( "firstName" ),
			lastName: req.param ( "lastName" ),
			login: req.param ( "login" ),
			password: req.param ( "password"),
			email: req.param ( "email" )
		};
		User.create ( newuser, function ( err, user ) {
			if ( err ) return res.send ( { result: "error", error: err } );
			res.send ( user );
		} );
	}

	self.delete = [
		passport.authenticate( oauth1tokenstrategy, { session: false } ),
		function ( req, res ) {
			req.user.destroy ( function ( err ) { // need to delete dependencies ..; (oauth tokens ...)
				if ( err ) return res.send ( { result: "error", error: err } );
				res.send ( { result: "ok" } );
			} );
		}
	];

}