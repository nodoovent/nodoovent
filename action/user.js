var passport = require ( "passport" );
var QueryChainer = require ( "../utils" ).QueryChainer;

var oauth1tokenstrategy = require ( "../auth/oauth1tokenstrategy" ).name;


module.exports = function ( models, auth ) {
	var self = this;

	self.models = models;
	self.auth = auth;

	var users = models.users;
	var oauth1requesttokens = models.oauth1requesttokens;
	var oauth1accesstokens = models.oauth1accesstokens;

	self.get = [
		passport.authenticate ( oauth1tokenstrategy, { session: false } ),
		function ( req, res ) {
			res.send ( req.user ); // call to req.user.toJSON ( )
		}
	];

	self.getById = [
		passport.authenticate ( oauth1tokenstrategy, { session: false } ),
		function ( req, res ) {
			users.findOne ( req.param ( "userid" ) ).exec ( function ( err, user ) {
				if ( err ) return res.status ( 500 ).send ( { result: "error", error: err } );
				if ( !user ) return res.status ( 404 ).send ( );
				res.send ( user );
			} );
		}
	];

	self.list = [
		passport.authenticate ( oauth1tokenstrategy, { session: false } ),
		function ( req, res ) {
			users.find ( function ( err, users ) {
				if ( err ) return res.status ( 500 ).send ( { result: "error", error: err } );
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
		users.create ( newuser, function ( err, user ) {
			if ( err ) return res.send ( { result: "error", error: err } );
			res.status ( 201 ).send ( user );
		} );
	}

	self.delete = [
		passport.authenticate( oauth1tokenstrategy, { session: false } ),
		function ( req, res ) {
			var chainer = new QueryChainer ( );
			chainer.add ( oauth1requesttokens, "destroy", null, { user: req.user.id } );
			chainer.add ( oauth1accesstokens, "destroy", null, { user: req.user.id } );
			chainer.add ( users, "destroy", null, { id: req.user.id } );
			chainer.run ( function ( errors ) {
				if ( errors ) return res.status ( 500 ).send ( { result: "error", errors: errors } );
				res.send ( { result: "ok" } )
			} );
		}
	];

}