var passport = require ( "passport" );

var OAuth1TokenStrategy = require ( "../auth/oauth1tokenstrategy" );
var oauth1TokenStrategy = OAuth1TokenStrategy.name;

var Utils = require ( "../utils/" );
var DateHelper = Utils.DateHelper;

module.exports = function ( models, auth ) {
	var self = this;

	self.models = models;
	self.auth = auth;

	var Todos = models.todos;

	self.create = [	// add a todo to the authenticate user
		passport.authenticate ( oauth1TokenStrategy, { session: false } ),
		function ( req, res ) {
			var dueAt = req.param ( "dueAt" );
			if ( dueAt === "" ) dueAt = null;
			var privacy = req.param ( "privacy" );
			var todo = {
				name: req.param ( "name" ),
				description: req.param ( "description" ),
				dueAt: dueAt,
				author: req.user.id,
				privacy: ( privacy || privacy == 1 || privacy == 2 ) ? privacy : 2,
				status: 1 // add conf.status Created id ???
			};
			// create the todo
			Todos.create ( todo, function ( err, todo ) {
				if ( err ) return res.send ( { result: "error", error: err } );
				Todos.findOne ( todo.id ).populate ( "privacy" ).populate ( "status" ).populate ( "author" ).exec ( function ( err, todo ) {
					if ( err ) return res.send ( { result: "error", error: err } );
					res.status ( 201 ).send ( todo );
				} );
			} );
		}
	];

	self.userList = [
		passport.authenticate ( oauth1TokenStrategy, { session: false } ),
		function ( req, res ) {
			var userid = req.param ( "userid" );
			var where = { author: userid };
			if ( userid != req.user.id )
				where.privacy = 1; // add conf.privacies Public id ???
			Todos.find ( ).where ( where ).exec ( function ( err, todos ) {
				if ( err ) return res.send ( { result: "error", error: err } );
				res.send ( todos );
			} );
		}
	];

	self.getById = [
		passport.authenticate ( oauth1TokenStrategy, { session: false } ),
		function ( req, res ) {
			Todos.findOne ( req.param ( "id" ) ).exec ( function ( err, todo ) {
				if ( err ) return res.send ( { result: "error", error: err } );
				if ( !todo ) return res.status ( 404 ).send ( );
				if ( todo.privacy == 2 && todo.author != req.user.id ) return res.status ( 403 ).send ( { result: "error", error: "You're not authorize to read this todo" } );
				res.send ( todo );
			} );
		}
	];

	self.delete = [
		passport.authenticate ( oauth1TokenStrategy, { session: false } ),
		function ( req, res ) {
			todos.findOne ( req.param ( "id" ) ).exec ( function ( err, todo ) {
				if ( err ) return res.send ( { result: "error", error: err } );
				if ( !todo ) return res.status ( 404 ).send ( );
				if ( todo.author != req.user.id ) return res.status ( 403 ).send ( { result: "error", error: "You're not authorize to read this todo" } );
				todo.destroy ( function ( err ) {
					if ( err ) return res.send ( { result: "error", error: err } );
					res.send ( { result: "ok" } );
				} );
			} );
		}
	];

	self.update = [
		passport.authenticate ( oauth1TokenStrategy, { session: false } ),
		function ( req, res ) {
			Todos.findOne ( req.param ( "id" ) ).exec ( function ( err, todo ) {
				if ( err ) return res.send ( { result: "error", error: err } );
				if ( !todo ) return res.status ( 404 ).send ( );
				if ( todo.author != req.user.id ) return res.status ( 403 ).send ( { result: "error", error: "You're not authorize to read this todo" } );

				// do not have id to update
				delete todo.id;

				if ( req.param ( "name" ) ) todo.name = req.param ( "name" );
				if ( req.param ( "description" ) ) todo.description = req.param ( "description" );
				if ( req.param ( "dueDate" ) ) todo.dueDate = req.param ( "dueDate" );
				if ( req.param ( "status" ) ) todo.status = req.param ( "status" );
				if ( req.param ( "privacy" ) ) todo.privacy = req.param ( "privacy" );

				Todos.update ( { id: req.param ( "id" ) }, function ( err, todo ) {
					if ( err ) return res.send ( { result: "error", error: err } );
					res.send ( todo );
				} );
			} );
		}
	];

	self.list = [
		passport.authenticate ( oauth1TokenStrategy, { session: false } ),
		function ( req, res ) {
			Todos.find ( ).where ( { or: [ { privacy: 1 }, { author: req.user.id } ] } ).populate ( "privacy" )
			.populate ( "status" ).populate ( "author" ).exec ( function ( err, todos ) {
				if ( err ) return res.send ( { result: "error", error: err } );
				res.send ( todos );
			} );
		}
	];

}