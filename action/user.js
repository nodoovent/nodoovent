var passport = require ( "passport" );
var QueryChainer = require ( "Sequelize" ).Utils.QueryChainer;

var oauth1tokenstrategy = require ( "../auth/oauth1tokenstrategy" ).name;


module.exports = function ( model, auth ) {
	var self = this;

	self.model = model;
	self.auth = auth;

	self.get = [
		passport.authenticate ( oauth1tokenstrategy, { session: false } ),
		function ( req, res ) {
			res.send ( req.user ); // call to req.user.toJSON ( )
		}
	];

	self.getById = [
		passport.authenticate ( oauth1tokenstrategy, { session: false } ),
		function ( req, res ) {
			var query = self.model.User.find ( req.param ( "userid" ) );
			query.success ( function ( user ) { res.send ( user ); } );
		}
	];

	self.getByLogin = [	// /!\ Unused /!\ ( gonna be used one day ??)
		passport.authenticate ( oauth1tokenstrategy, { session: false } ),
		function ( req, res ) {
			console.log ( req.param ( "login" ) );
			var query = self.model.User.find ( { where: { login: req.param ( "login" ) } } );
			query.success ( function ( user ) { res.send ( user ); } );
		}
	];

	self.list = [
		passport.authenticate ( oauth1tokenstrategy, { session: false } ),
		function ( req, res ) {
			var query = self.model.User.findAll ( );
			query.success ( function ( users ) { res.send ( users ); } )
		}
	];

	self.update = [
		passport.authenticate ( oauth1tokenstrategy, { session: false } ),
		function ( req, res ) {
			if ( req.param ( "firstName") )
				req.user.firstName = req.param ( "firstName");
			if ( req.param ( "lastName") )
				req.user.lastName = req.param ( "lastName");
			if ( req.param ( "email") )
				req.user.email = req.param ( "email");
			if ( req.param ( "password") )
				req.user.firstName = req.param ( "password");

			var query = req.user.save ( );
			query.success ( function ( user ) { res.send ( user ); } )
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
		var query = self.model.User.create ( newuser );
		query.success ( function ( user ) { res.send ( user ); } );
	}

	self.delete = [
		passport.authenticate( oauth1tokenstrategy, { session: false } ),
		function ( req, res ) {
			var query = req.user.destroy ( );
			query.success ( function ( ) { res.send ( { result: "ok" } ); } );
		}
	];

	self.addContact = [
		passport.authenticate( oauth1tokenstrategy, { session: false } ),
		function ( req, res ) {
			var query = self.model.User.find ( req.param ( "contact" ) );
			query.success ( function ( user ) {
				var query = req.user.hasContact ( user );
				query.success ( function ( result ) {
					if ( result ) {
						self.contactList[1] ( req, res );
					} else {
						var query = req.user.addContact ( user );
						query.success ( function ( user ) { self.contactList[1] ( req, res ); } );
					}
				} );
			} );
		}
	];

	self.contactList = [
		passport.authenticate( oauth1tokenstrategy, { session: false } ),
		function ( req, res ) {
			var query = req.user.getContact ( );
			query.success ( function ( contacts ) {
				var users = [ ];
				for ( var i in contacts ) users.push ( { id: contacts[i].dataValues.id, login: contacts[i].dataValues.login } );
				res.send ( users );
			} );
		}	
	];

	self.deleteContact = [
		passport.authenticate( oauth1tokenstrategy, { session: false } ),
		function ( req, res ) {
			var query = self.model.User.find ( req.param ( "id" ) );
			query.success ( function ( user ) {
				var query = req.user.removeContact ( user );
				query.success ( function ( ) { res.send ( { result: "ok" } ); } );
				query.error ( function ( err ) { res.send ( { result: "error", error: err } ); } );
			} );
		}
	];

	self.getContact = [
		passport.authenticate( oauth1tokenstrategy, { session: false } ),
		function ( req, res ) {
			var query = self.model.User.find ( req.param ( "id" ) );
			query.success ( function ( user ) {
				var query = req.user.hasContact ( user );
				query.success ( function ( result ) {
					if ( result ) res.send ( {id: user.id, login: user.login } );
					else res.send ( { } );
				} );
			} );
		}
	];

}