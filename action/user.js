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

	// self.getById = [
	// 	passport.authenticate ( oauth1tokenstrategy, { session: false } ),
	// 	function ( req, res ) {
	// 		User.find ( req.param ( "userid" ), function ( err, user ) {
	// 			if ( err ) return res.send ( { result: "error", error: err } );
	// 			if ( !user ) return res.status ( 404 ).send ( );
	// 			res.send ( user );
	// 		} );
	// 	}
	// ];

	// self.list = [
	// 	passport.authenticate ( oauth1tokenstrategy, { session: false } ),
	// 	function ( req, res ) {
	// 		User.all ( function ( err, users ) {
	// 			if ( err ) return res.send ( { result: "error", error: err } );
	// 			res.send ( users );
	// 		} );
	// 	}
	// ];

	// self.update = [
	// 	passport.authenticate ( oauth1tokenstrategy, { session: false } ),
	// 	function ( req, res ) {
	// 		if ( req.param ( "firstName" ) )
	// 			req.user.firstName = req.param ( "firstName" );
	// 		if ( req.param ( "lastName" ) )
	// 			req.user.lastName = req.param ( "lastName" );
	// 		if ( req.param ( "email" ) || req.param ( "email" ) == "" )
	// 			req.user.email = req.param ( "email" );
	// 		if ( req.param ( "password" ) || req.param ( "password" ) == "" )
	// 			req.user.password = req.param ( "password" );

	// 		req.user.save ( function ( err, user ) {
	// 			if ( err ) return res.send ( { result: "error", error: err } );
	// 			res.send ( user );
	// 		} );
	// 	}
	// ];

	// self.create = function ( req, res ) {
	// 	var newuser = {
	// 		firstName: req.param ( "firstName" ),
	// 		lastName: req.param ( "lastName" ),
	// 		login: req.param ( "login" ),
	// 		password: req.param ( "password"),
	// 		email: req.param ( "email" )
	// 	};
	// 	User.create ( newuser, function ( err, user ) {
	// 		if ( err ) return res.send ( { result: "error", error: err } );
	// 		res.status ( 201 ).send ( user );
	// 	} );
	// }

	// self.delete = [
	// 	passport.authenticate( oauth1tokenstrategy, { session: false } ),
	// 	function ( req, res ) {
	// 		var requesttokens = [ ];
	// 		var accesstokens = [ ];

	// 		var chainer = new QueryChainer ( );
	// 		chainer.add ( OAuth1RequestToken, "all", { where: { user: req.user.id } }, function ( err, tokens ) {
	// 			if ( err ) return;
	// 			requesttokens = tokens;
	// 		} );
	// 		chainer.add ( OAuth1AccessToken, "all", { where: { user: req.user.id } }, function ( err, tokens ) {
	// 			if ( err ) return;
	// 			accesstokens = tokens;
	// 		} );
	// 		chainer.run ( function ( errors ) {
	// 			var chainer = new QueryChainer ( );
	// 			for ( var i in requesttokens ) chainer.add ( requesttokens[i], "destroy" );
	// 			for ( var i in accesstokens ) chainer.add ( accesstokens[i], "destroy" );
	// 			chainer.add ( req.user, "destroy" );
	// 			chainer.run ( function ( errors ) {
	// 				if ( errors ) return res.send ( { result: "error", error: errors } );
	// 				res.send ( { result: "ok" } );
	// 			} );
	// 		} );
	// 	}
	// ];

}